from __future__ import unicode_literals

from django.conf import settings
from django.db import models

import json

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

    objects = GameManager()

    winner = models.CharField(max_length=5)
    loser = models.CharField(max_length=5)
    winner_score = models.PositiveIntegerField()
    loser_score = models.PositiveIntegerField()
    season = models.ForeignKey('Season', on_delete=models.CASCADE, related_name='games')
    date = models.DateField()

class Season(models.Model):
    """
    Contains a circle of suck for a given year and conference.
    """

    sport = models.CharField(max_length=100, choices=[(x, x) for x in SPORTS])
    conference = models.CharField(max_length=100, choices=[(conference_id, conference['name']) for conference_id, conference in CONFERENCES.items()])
    year = models.IntegerField()
    circle_of_suck = models.TextField()

    def get_school_records(self, school):
        """Return a tuple of lists that store the wins and losses respectively"""
        wins = list(self.games.filter(winner=school))
        losses = list(self.games.filter(loser=school))
        return (wins, losses)

    def get_circle_of_suck(self):
        """
        Returns the circle of suck with School objects
        """
        return [
            [School.get(school_id) for school_id in cycle]
            for cycle in json.loads(self.circle_of_suck)
        ]

    def set_circle_of_suck(self, circle_of_suck):
        """
        Set the given circle of suck, as a list of school IDs; see base.constants
        for the list of school IDs (the IDs returned from the API). Still need
        to save to store data in database
        """
        self.circle_of_suck = json.dumps(circle_of_suck)
