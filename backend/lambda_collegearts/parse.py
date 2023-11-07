import logging
import html
import re
import datetime
from bs4 import BeautifulSoup, NavigableString, Tag
from prisma import Prisma, types
from scrape import ROOT
from slugify import slugify

logger = logging.getLogger()

ORGANIZATION_ID = "collegearts"


def parse_production_urls(page_soup: BeautifulSoup) -> list[str]:
    """Parses URLs to scrape from a top-level production index
    :param page_html: HTML from a top-level production index"""
    production_rows = page_soup.find_all("div", {"class": "views-row"})
    return [row.find("a")["href"] for row in production_rows]


def parse_production(production_url: str, page_soup: BeautifulSoup):
    """Parses a production's information from a production page's HTML.
    :param production_url: URL of the production on collegearts.com."""
    soup = page_soup.find("div", {"id": "zone-content"})

    # Set up basic production input data structure
    slug = production_url.replace("/events/shows-screenings/", "")
    logger.info("Parsing production " + slug)
    production: types.ProductionCreateInput = {
        "organization": {"connect": {"id": ORGANIZATION_ID}},
        "slug": slug,
        "href": ROOT + production_url,
    }

    # 1: Title
    production["name"] = soup.find("h1").text.strip()
    # 2: Date
    date_section = soup.find("div", {"class": "group-performance-date-"})
    if date_section is None:
        print("No date was found for this production.")
    else:
        date_section_rows = date_section.findChildren(recursive=False)
        parse_mode = None
        dates = []
        for row in date_section_rows:
            if row.name not in ("h2", "p"):
                continue
            text = html.unescape(row.text.strip())
            if row.name == "h2":
                parse_mode = text
            elif parse_mode == "Performance Dates & Times":
                # Note: we are throwing out time data here.
                # We probably don't need it but we could get it if we want.
                dt = datetime.datetime.strptime(text.split(" - ")[0], "%B %d, %Y")
                dates.append(dt)
        if dates:
            # We don't track opening / closing, but we could
            # production["open_date"] = dates[0]
            # production["close_date"] = dates[-1]
            production["date"] = dates[0]
    # 3: Description
    description = soup.find("div", {"class": "field-name-body"})
    if description:
        production["description"] = description.get_text()
    # 4. Poster
    poster = soup.find("div", {"class": "field-name-field-poster"}).find("a")
    if poster:
        production["imageHref"] = poster["href"]
        posterImg = poster.find("img")
        if posterImg:
            production["imageAlt"] = posterImg["alt"]

    print(production)
    return production


def parse_people_and_edges(page_soup: BeautifulSoup):
    """Parses a production's people and edges from a production page's HTML.
    :param production_url: URL of the production on collegearts.com."""
    soup = page_soup.find("div", {"id": "zone-content"})

    pairs: list[
        tuple[types.PersonCreateInput, types.ProductionPersonEdgeCreateInput]
    ] = []

    # Currently, we only scrape "Cast" and "Staff" tables
    table_classes = ["group-cast-column", "group-staff-column"]
    for table_class in table_classes:
        table = soup.find("div", {"class": table_class})
        if not table:
            continue
        header = table.find("h2")
        if not header:
            continue

        # Once we know the labelled table exists, iterate its rows
        edge_group = header.text.strip()
        rows = table.find_all("div", {"class": "field-collection-view"})
        for row in rows:
            # This is a link to a CollegeArts person's bio. If not found, we
            # currently skip adding them to the database, as we can't get an
            # identifier from them.
            link = row.find("a")
            if link is None:
                logger.info("No link found, skipping this person.")
                continue

            # 1. Person
            # We ID people from CollegeArts based on their internal ID.
            # TODO: Class year + resco? Need to go to user's page to get that
            person_name: str = link.text.strip()
            if person_name == "":
                continue
            person: types.PersonCreateInput = {
                "name": link.text.strip(),
                "slugName": slugify(person_name),
                "href": ROOT + link["href"],
            }

            # 2. Edge
            # Any number of edges can be created from 1 person to 1 production
            role_class = (
                "field-name-field-character"
                if edge_group == "Performers"
                else "field-name-field-role"
            )
            role_elem = row.find("div", {"class": role_class})
            role = role_elem.text.strip() if role_elem else "n"
            edge: types.ProductionPersonEdgeCreateInput = {
                "role": role,
                "group": edge_group,
            }

            # Add pair to all pairs
            pairs.append((person, edge))

    return pairs
