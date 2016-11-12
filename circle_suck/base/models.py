from __future__ import unicode_literals

from django.conf import settings
from django.db import models

from base.constants import *


class School(object):
    """
    Using our own implementation to avoid populating a database
    with fixed data.
    """
    def __init__(self, school_id, name, conference_id):
        self.id = school_id
        self.name = name
        self.logo = settings.STATIC_URL + 'img/%s/%s.png' % (
            conference_id.lower(), school_id.lower()
        )

    @classmethod
    def get_conference(cls, conference_id):
        """Return list of schools in given conference"""
        return CONFERENCES[conference_id]['schools']

    @classmethod
    def get(cls, school_id):
        return SCHOOLS[school_id]

# convert CONFERENCES and SCHOOLS to map to School objects initially
for conference_id, conference in CONFERENCES.items():
    conference['schools'] = [
        School(school_id, name, conference_id)
        for school_id, name in conference['schools'].items()
    ]

for school_id, school in SCHOOLS.items():
    SCHOOLS[school_id] = School(school_id, school['name'], school['conference'])

class Game(models.Model):
    """
    Stores information about a game's winner, loser, and their respective scores.
    """

    winner = models.CharField(max_length=5)
    loser = models.CharField(max_length=5)
    winner_score = models.PositiveIntegerField()
    loser_score = models.PositiveIntegerField()
    season = models.ForeignKey('Season', on_delete=models.,CASCADE)
    date = models.DateField()

class Season(models.Model):
    """
    Contains a circle of suck for a given year and conference.
    """

    sport = models.ChoiceField(choices=[(x, x) for x in SPORTS])
    conference = model.ChoiceField(choices=[(conference_id, conference['name']) for conference_id, conference in CONFERENCES.items()])
    year = model.IntegerField()
    circle_of_suck = models.TextField()

