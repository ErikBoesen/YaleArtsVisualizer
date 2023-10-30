import requests
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger()

ROOT = "https://collegearts.yale.edu"


def download_productions_list_page(number: int):
    """
    Download the HTML content of the CollegeArts page with the given number.
    :param number: Number of page to download. Note that this is zero-indexed.
    """
    cookies = {}
    headers = {}
    data = {
        "page": str(number),
        "view_name": "shows_and_screenings",
        "view_display_id": "block_1",
        "pager_element": "0",
    }

    response = requests.post(
        ROOT + "/views/ajax", cookies=cookies, headers=headers, data=data
    )
    page_html = response.json()[2]["data"]
    return BeautifulSoup(page_html, "html.parser")


def download_production_page(production_url: str):
    """Returns the BeautifulSoup of a production's page data."""
    # Download page body and return it as pared-down BeautifulSoup
    page_html = requests.get(ROOT + production_url).text
    return BeautifulSoup(page_html, "html.parser")
