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
    relationship_type = table.find('h2').text.strip()
    rows = table.find_all('div', {'class': 'field-collection-view'})
    for row in rows:
        link = row.find('a')
        person_id = link['href'].replace('/biography/', '')
        role_class = 'field-name-field-character' if relationship_type == 'Performers' else 'field-name-field-role'
        role = row.find('div', {'class': role_class}).text.strip()
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
    if page_number == 1:
        break

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
    production = {
        'id': production_url.replace('/events/shows-screenings/', ''),
    }
    page_html = download_production_page(production_url)
    soup = BeautifulSoup(page_html, 'html.parser')
    soup = soup.find('div', {'id': 'zone-content'})
    production['title'] = soup.find('h1').text.strip()
    date_section = soup.find('div', {'class': 'group-performance-date-'})
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
    location = date_section.find('div', {'class': 'group-location'}).find('div', {'class': 'field-item'}).text.strip()
    production['location'] = location
    production['open_date'] = dates[0]
    production['close_date'] = dates[-1]

    relationships = []
    performance_people = []

    cast_relationships, cast_people = scrape_people_list(soup.find('div', {'class': 'group-cast-column'}))
    relationships += cast_relationships
    performance_people += cast_people
    staff_relationships, staff_people = scrape_people_list(soup.find('div', {'class': 'group-staff-column'}))
    relationships += staff_relationships
    performance_people += staff_people

    production['relationships'] = relationships

    for person in performance_people:
        if person['id'] not in people:
            people[person['id']] = person
            people[person['id']]['productions'] = []
        # TODO: should probably use a set for this. But more annoying to turn into JSON later on :(
        if production['id'] not in people[person['id']]['productions']:
            people[person['id']]['productions'].append(production['id'])

    productions[production['id']] = production

with open('productions.json', 'w') as f:
    json.dump(productions, f, indent=4)
with open('people.json', 'w') as f:
    json.dump(people, f, indent=4)
