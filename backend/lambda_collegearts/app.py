import logging
from prisma import Prisma
from aws_lambda_typing import context as context_

# ----------------------------------- Setup ---------------------------------- #

logger = logging.getLogger()
logger.setLevel(logging.INFO)
# init our prisma object

# ---------------------------------------------------------------------------- #
#                                    Handler                                   #
# ---------------------------------------------------------------------------- #


def handler(event, context: context_.Context):
    db = Prisma()
    db.connect()
    person = db.person.create(
        data={
            "name": "Evan Kirkiles",
        }
    )
    logger.info(person)
    db.disconnect()
