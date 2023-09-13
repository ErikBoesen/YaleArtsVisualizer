import os
import sys
import logging
import pymysql
import pymysql.cursors
from aws_lambda_typing import context as context_

# ----------------------------------- Setup ---------------------------------- #

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Load ENV variables
DATABASE = os.getenv("DATABASE")
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")

# Open connection to the PlanetScale database
try:
    conn = pymysql.connect(
        host=DATABASE_HOST,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD,
        database=DATABASE,
        cursorclass=pymysql.cursors.DictCursor,
    )
except:
    logger.error("ERROR: Unexpected error: Could not connect to MySql instance.")
    sys.exit()

# ---------------------------------------------------------------------------- #
#                                    Handler                                   #
# ---------------------------------------------------------------------------- #


def handler(event, context: context_.Context):
    with conn.cursor() as cur:
        cur.execute
