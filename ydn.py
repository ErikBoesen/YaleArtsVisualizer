import requests
from bs4 import BeautifulSoup
import html
import datetime
import json

page = 1
posts = []

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0',
}
categories = {}
page = 1
while True:
    categories_page = requests.get('https://yaledailynews.com/wp-json/wp/v2/categories',
                                   params={'page': page, 'per_page': 100},
                                   headers=headers).json()
    if not isinstance(categories_page, list) or len(categories_page) == 0:
        break
    for category in categories_page:
        categories[category['id']] = category['name']
    page += 1

print(categories)

page = 1
while True:
    try:
        posts_page = requests.get('https://yaledailynews.com/wp-json/wp/v2/posts',
                                  params={'page': page, 'per_page': 25},
                                  headers=headers).json()
    except requests.exceptions.JSONDecodeError:
        print(f'Failed on page {page}. Skipping.')
    print(f'Pulled page {page} of posts.')
    if not isinstance(posts_page, list):
        break
    if post['categories']
    for post in posts_page:
        posts.append({
            'id': post['id'],
            'slug': post['slug'],
            'url': post['link'],
            'date': post['date'].split('T')[0],
            'category': categories[
        })
    page += 1
    if page == 100:
        break

authors = {}
links = []
for post in posts:
    post_page = requests.get(post['url'], headers=headers).text
    soup = BeautifulSoup(post_page, 'html.parser')
    author_links = soup.select('a.author.url')
    for link in author_links:
        print(link)
        print(link.get('href'))
        author_id = link.get('href').replace('https://yaledailynews.com/blog/author/', '').strip('/')
        author_name = link.text.strip()
        if author_id not in authors:
            authors[author_id] = {
                'id': author_id,
                'name': author_name,
            }
        links.append({
            'source': author_id,
            'target': post['id'],
        })

nodes = posts + list(authors.values())

with open('ydn_graph.json', 'w') as f:
    json.dump({'nodes': nodes, 'links': links}, f)
