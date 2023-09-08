import requests
from bs4 import BeautifulSoup


def download_page(number):
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
    print(response.json()[2]['data'])


page_number = 0
while True:  # TODO: clean this up
    page_html = download_page(page_number)
    soup = BeautifulSoup(page_html, 'html.parser')
    production_rows = soup.find_all('div', {'class': 'views-row'})
    print(production_rows)
    page_number += 1
