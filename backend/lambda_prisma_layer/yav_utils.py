#
# yav_utils.py
# Author: Evan Kirkiles
# Created on: Wed Sep 13 2023
# 2023 Yale SWE
#
# https://github.com/aws-samples/aws-serverless-app-with-aurora-and-python-sql-alchemy-example/blob/main/db_schema/db_schema_lambda_layer/python/bookstore_utils.py
#

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

Session = None


def create_db_engine(
    host: str, user: str, password: str, database: str, debug_mode=False
):
    """Connects the SQLAlchemy ORM to the PlanetScale database."""
    return create_engine(
        f"mysql+mysqlconnector://{user}:{password}@{host}/{database}",
        echo=debug_mode,
        pool_size=1,
        max_overflow=0,
        pool_recycle=3600,
        pool_pre_ping=True,
        pool_use_lifo=True,
    )


def create_db_session(engine):
    global Session
    if not Session:
        Session = sessionmaker(bind=engine)
        # todo: setup connection pooling properties
    return Session()
