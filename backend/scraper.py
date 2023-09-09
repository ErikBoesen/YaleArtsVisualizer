import requests
from bs4 import BeautifulSoup
import html
import datetime
import json

ROOT = 'https://collegearts.yale.edu'

def download_productions_page(number):
    """
    Download the HTML content of the page with the given number.
    :param number: Number of page to download. Note that this is zero-indexed.
    """
    cookies = {}
    headers = {}
    data = {
        'page': str(number),
        'view_name': 'shows_and_screenings',
        'view_display_id': 'block_1',
        'pager_element': '0',
    }

    response = requests.post(ROOT + '/views/ajax', cookies=cookies, headers=headers, data=data)
    return response.json()[2]['data']

def download_production_page(path):
    html = requests.get(ROOT + production_url).text
    return html

def scrape_people_list(table):
    relationships = []
    people = []
    header = table.find('h2')
    if not header:
        return [], []
    relationship_type = header.text.strip()
    rows = table.find_all('div', {'class': 'field-collection-view'})
    for row in rows:
        link = row.find('a')
        if link is None:
            print('No link found, skipping this person.')
            continue
        person_id = link['href'].replace('/biography/', '')
        role_class = 'field-name-field-character' if relationship_type == 'Performers' else 'field-name-field-role'
        role_elem = row.find('div', {'class': role_class})
        role = role_elem.text.strip() if role_elem else None
        relationships.append({
            'relationship_type': relationship_type,
            'role': role,
            'person_id': person_id,
        })
        people.append({
            'id': person_id,
            'name': link.text.strip(),
        })
    return relationships, people


page_number = 0
production_urls = []
while True:  # TODO: clean this up
    # TEMPORARY early exit
    #if page_number == 1:
    #    break

    page_html = download_productions_page(page_number)
    soup = BeautifulSoup(page_html, 'html.parser')
    production_rows = soup.find_all('div', {'class': 'views-row'})
    production_urls_page = [row.find('a')['href'] for row in production_rows]
    if len(production_urls_page) == 0:
        print(f'Found 0 productions on page {page_number}; terminating loop.')
        break
    production_urls += production_urls_page
    print(f'Scraped page {page_number} and located {len(production_urls_page)} productions (total {len(production_urls)}).')
    page_number += 1

productions = {}
people = {}
for production_url in production_urls:
    production_id = production_url.replace('/events/shows-screenings/', '')
    print('Parsing production ' + production_id)
    production = {
        'id': production_id,
    }
    page_html = download_production_page(production_url)
    soup = BeautifulSoup(page_html, 'html.parser')
    soup = soup.find('div', {'id': 'zone-content'})
    production['title'] = soup.find('h1').text.strip()
    date_section = soup.find('div', {'class': 'group-performance-date-'})
    if date_section is None:
        print('No date was found for this production.')
    else:
        date_section_rows = date_section.findChildren(recursive=False)
        parse_mode = None
        dates = []
        for row in date_section_rows:
            if row.name not in ('h2', 'p'):
                continue
            text = html.unescape(row.text.strip())
            if row.name == 'h2':
                parse_mode = text
            elif parse_mode == 'Performance Dates & Times':
                # Note: we are throwing out time data here.
                # We probably don't need it but we could get it if we want.
                dt = datetime.datetime.strptime(text.split(' - ')[0], '%B %d, %Y')
                dates.append(dt.strftime('%Y-%m-%d'))
        if dates:
            production['open_date'] = dates[0]
            production['close_date'] = dates[-1]

    relationships = []
    performance_people = []

    cast_table = soup.find('div', {'class': 'group-cast-column'})
    if cast_table:
        cast_relationships, cast_people = scrape_people_list(cast_table)
        relationships += cast_relationships
        performance_people += cast_people
    staff_table = soup.find('div', {'class': 'group-staff-column'})
    if staff_table:
        staff_relationships, staff_people = scrape_people_list(staff_table)
        relationships += staff_relationships
        performance_people += staff_people

    production['relationships'] = relationships

    for person in performance_people:
        if person['id'] not in people:
            people[person['id']] = person
            people[person['id']]['in'] = []
        # TODO: should probably use a set for this. But more annoying to turn into JSON later on :(
        if production['id'] not in people[person['id']]['in']:
            people[person['id']]['in'].append(production['id'])

    productions[production['id']] = production

# Map all string IDs to a much shorter string so the output files are less huge
base = 92
start_point = 34
def number_compress(number: int) -> str:
    if number == 0:
        return ''
    digits = ''
    while number:
        digits += chr(number % base + start_point)
        number //= base
    return digits[::-1]

production_id_map = {}
for index, key in enumerate(productions.keys()):
    production_id_map[key] = number_compress(index)
person_id_map = {}
for index, key in enumerate(people.keys()):
    person_id_map[key] = number_compress(index)
print(production_id_map)
print(person_id_map)

new_people = {}
for person_id, person in people.items():
    person['in'] = [production_id_map[production_id] for production_id in person['in']]
    new_people[person_id_map[person_id]] = person
people = new_people
new_productions = {}
for production_id, production in productions.items():
    # NOTE: we are throwing out the person's role name and type to keep the output file small.
    # This might be something we want to keep later.
    relationships = production.pop('relationships')
    production['in'] = list(set([person_id_map[relationship['person_id']] for relationship in relationships]))
    # Skip productions with nobody in them
    if not production['in']:
        continue
    new_productions[production_id_map[production_id]] = production
productions = new_productions

with open('productions.json', 'w') as f:
    json.dump(productions, f)
with open('people.json', 'w') as f:
    json.dump(people, f)
