#
# app.py
# Author: Evan Kirkiles
# Created on: Wed Sep 13 2023
# 2023 Yale SWE
#
import os
import sys
import logging
from aws_lambda_typing import context as context_

# ----------------------------------- Setup ---------------------------------- #

try:
    from yav_orm_objects import Base
    from yav_utils import create_db_engine
except ModuleNotFoundError as e:
    # Weird Lambda layer import setup to enable running locally
    sys.path.append("../")
    from lambda_layer.yav_orm_objects import Base
    from lambda_layer.yav_utils import create_db_engine

logger = logging.getLogger(__name__)

# Load ENV variables
DATABASE = os.getenv("DATABASE")
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")

# ---------------------------------------------------------------------------- #
#                                    Handler                                   #
# ---------------------------------------------------------------------------- #


def handler(event, context: context_.Context):
    logger.info(f'Creating SQLAlchemy database engine for database: "{DATABASE}"')
    engine = create_db_engine(
        host=DATABASE_HOST,
        user=DATABASE_USERNAME,
        password=DATABASE_PASSWORD,
        database=DATABASE,
    )

    logger.info(f'Creating or Updating DB schema for database: "{DATABASE}"')
    Base.metadata.create_all(engine)

    return f"{DATABASE}-schema"
