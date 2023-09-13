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
while True:
    posts_page = requests.get('https://yaledailynews.com/wp-json/wp/v2/posts',
                              params={'page': page, 'per_page': 100},
                              headers=headers).json()
    if not isinstance(posts_page, list):
        break
    for post in posts_page:
        posts.append({
            'id': post['id'],
            'slug': post['slug'],
            'url': post['link'],
        })
    page += 1
    if page == 2:
        break

authors = {}
links = []
for post in posts:
    post_page = requests.get(post['url']).text
    soup = BeautifulSoup(post_page, 'html.parser')
    links = soup.select('a.author.url')
    print(links)
    for link in links:
        author_id = link['href'].replace('https://yaledailynews.com/blog/author/', '').strip('/')
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
