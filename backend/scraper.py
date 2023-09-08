import requests
from bs4 import BeautifulSoup


cookies = {}
headers = {}
data = {
    'page': '10',
    'view_name': 'shows_and_screenings',
    'view_display_id': 'block_1',
    'pager_element': '0',
}

response = requests.post('https://collegearts.yale.edu/views/ajax', cookies=cookies, headers=headers, data=data)
print(response.json()[2]['data'])

