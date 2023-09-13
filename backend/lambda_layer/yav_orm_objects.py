#
# yav_orm_objects.py
# Author: Evan Kirkiles
# Created on: Wed Sep 13 2023
# 2023 Yale SWE
#
# https://github.com/aws-samples/aws-serverless-app-with-aurora-and-python-sql-alchemy-example/blob/main/db_schema/db_schema_lambda_layer/python/bookstore_orm_objects.py
#
from __future__ import annotations
from sqlalchemy import Table, Column, Integer, String, Date
from sqlalchemy import ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, mapped_column, Mapped
import datetime

Base = declarative_base()


def create_db_schema(engine):
    """Initializes the SQLAlchemy ORM to allow easier SQL operations."""
    Base.metadata.create_all(engine)


# ---------------------------------------------------------------------------- #
#                                    Schema                                    #
# ---------------------------------------------------------------------------- #


class Production(Base):
    """A Production is a basic atom connected to different Persons.

    A production can be anything—a Yale College Arts performance, a YDN article,
    a Yale SoA thesis show, etc. Anything we can scrape.
    """

    __tablename__ = "productions"

    id: Mapped[int] = Column(Integer, primary_key=True)
    title: Mapped[str] = Column(String(200), nullable=False)
    date: Mapped[datetime.date] = Column(Date, nullable=True)

    # Our many-to-many production -> persons direction
    persons: Mapped[list[Person]] = relationship(back_populates="production")

    def __repr__(self):
        return "<Production(title='%s', date='%s')>" % (self.title, self.date)

    def __init__(self, title: str, date: datetime.date | None):
        self.title = title
        self.date = date


class ProductionPersonAssociation(Base):
    """An association table linking Productions to Persons."""

    __tablename__ = "productions_persons"
    person_id: Mapped[int] = mapped_column(ForeignKey("person.id"), primary_key=True)
    production_id: Mapped[int] = mapped_column(
        ForeignKey("production.id"), primary_key=True
    )
    role: Mapped[str | None] = Column(String(200), nullable=True)

    # Inferred objects from the relationship
    person: Mapped[Person] = relationship(back_populates="productions")
    production: Mapped[Production] = relationship(back_populates="persons")


class Person(Base):
    """A <Person> is exactly that, a person.

    We should shove whatever data we can possibly scrape into this data type.
    """

    __tablename__ = "persons"

    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)

    # Our many-to-many production -> persons direction
    productions: Mapped[list[Production]] = relationship(back_populates="persons")

    def __repr__(self):
        return "<Person(name='%s')>" % (self.title, self.date)

    def __init__(self, name: str):
        self.name = name
