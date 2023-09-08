import requests
from bs4 import BeautifulSoup



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

    response = requests.post('https://collegearts.yale.edu/views/ajax', cookies=cookies, headers=headers, data=data)
    return response.json()[2]['data']

def download_production_page(path):
    html = requests.get(production_url).text


page_number = 0
production_urls = []
while True:  # TODO: clean this up
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

for production_urls in production_urls:


