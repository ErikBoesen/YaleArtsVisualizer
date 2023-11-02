import logging
import sys
import os
import json
from prisma import Prisma
from aws_lambda_typing import context as context_

from scrape import download_productions_list_page, download_production_page
from parse import (
    ORGANIZATION_ID,
    parse_production_urls,
    parse_production,
    parse_people_and_edges,
)

# ----------------------------------- Setup ---------------------------------- #

logger = logging.getLogger()
logger.setLevel(logging.INFO)
if os.getenv("LAMBDA_TASK_ROOT") == None:
    logger.addHandler(logging.StreamHandler(sys.stdout))  # to print when local

# Debugging things
MAX_PRODUCTION_PAGES = 10

# ---------------------------------------------------------------------------- #
#                                    Handler                                   #
# ---------------------------------------------------------------------------- #


def handler(event, context: context_.Context):
    # Open a Prisma connection
    db = Prisma()
    db.connect()

    try:
        with open("./scraped.json", "r+") as f:
            cache = json.load(f)
    except:
        cache = {"scraped_pages": {}}

    try:
        # Retrieve all of the production URLs from College Arts Shows & Screenings.
        page_number = 0
        production_urls = []
        while True:
            productions_page = download_productions_list_page(page_number)
            production_urls_on_page = parse_production_urls(productions_page)
            if len(production_urls_on_page) == 0:
                logger.info(
                    f"Found 0 productions on page {page_number}; terminating loop."
                )
                break
            production_urls += production_urls_on_page
            logger.info(
                f"Scraped page {page_number} and located {len(production_urls_on_page)} productions (total {len(production_urls)})."
            )
            page_number += 1
            if page_number > MAX_PRODUCTION_PAGES:
                break

        # Now, for each production, download, parse, and upsert to database.
        # We could do this more efficiently by putting below in its own Lambda
        # function and using an SQS queue populated with production_urls.
        for production_url in production_urls:
            if production_url in cache["scraped_pages"]:
                logger.info(
                    f"CACHED: {production_url} ({cache['scraped_pages'][production_url]} links)"
                )
                continue
            production_page = download_production_page(production_url)
            production = parse_production(production_url, production_page)
            people_edge_pairs = parse_people_and_edges(production_page)
            if len(people_edge_pairs) == 0:
                # Add the scraped page to the cache
                cache["scraped_pages"][production_url] = 0
                continue

            # !!! IMPORTANT: We don't do diff-based deletions at this point!
            # Not sure if that's something we need to worry about either.
            # 1. Upsert the production
            production_final = db.production.upsert(
                data={"create": production, "update": {}},
                where={
                    "slug_organizationId": {
                        "organizationId": ORGANIZATION_ID,
                        "slug": production["slug"],
                    }
                },
            )

            # 2. Upsert people sequentially (same transaction), get response
            transacted_people_ids: dict[str, int] = {}
            with db.tx(timeout=10000) as transaction:
                for person, _ in people_edge_pairs:
                    slugName = person["slugName"]
                    year = person.get("year", 0)
                    person_final = transaction.person.upsert(
                        data={"create": person, "update": {}},
                        where={
                            "slugName_year": {
                                "slugName": slugName,
                                "year": year,
                            }
                        },
                    )
                    transacted_people_ids[f"{slugName}_{year}"] = person_final.id

            # 3. Upsert all of the edges using person + production IDs
            with db.batch_() as batch:
                for person, edge in people_edge_pairs:
                    production_id = production_final.id
                    slugName = person["slugName"]
                    year = person.get("year", 0)
                    person_id = transacted_people_ids[f"{slugName}_{year}"]
                    batch.productionpersonedge.upsert(
                        data={
                            "create": {
                                **edge,
                                "production": {"connect": {"id": production_id}},
                                "person": {"connect": {"id": person_id}},
                            },
                            "update": {},
                        },
                        where={
                            "productionId_personId_role": {
                                "productionId": production_id,
                                "personId": person_id,
                                "role": edge.get("role", "n"),
                            }
                        },
                    )

            logging.info(f"")
            # Add the scraped page to the cache
            cache["scraped_pages"][production_url] = len(people_edge_pairs)

    # Make sure we always close the connection
    finally:
        with open("./scraped.json", "w+") as f:
            json.dump(cache, f, indent=2)
        db.disconnect()


if __name__ == "__main__":
    # Retrieve all of the production URLs from College Arts Shows & Screenings.
    handler(None, None)
    # page_number = 0
    # production_urls = []
    # while True:
    #     productions_page = download_productions_list_page(page_number)
    #     production_urls_on_page = parse_production_urls(productions_page)
    #     if len(production_urls_on_page) == 0:
    #         logger.info(f"Found 0 productions on page {page_number}; terminating loop.")
    #         break
    #     production_urls += production_urls_on_page
    #     logger.info(
    #         f"Scraped page {page_number} and located {len(production_urls_on_page)} productions (total {len(production_urls)})."
    #     )
    #     page_number += 1
    #     if page_number > MAX_PRODUCTION_PAGES:
    #         break

    # for production_url in production_urls:
    #     production_page = download_production_page(production_url)
    #     production = parse_production(production_url, production_page)
    #     people_edge_pairs = parse_people_and_edges(production_page)
    #     if len(people_edge_pairs) == 0:
    #         continue
    #     print(production)
    #     print(people_edge_pairs)
    #     input()
