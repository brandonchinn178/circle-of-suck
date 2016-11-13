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

    def __repr__(self):
        return '<School %s>' % self.id

    def __str__(self):
        return self.name

    def __eq__(self, other):
        return self.id == other.id

    @classmethod
    def get_conference(cls, conference_id):
        """Return list of schools in given conference"""
        return CONFERENCES[conference_id]['schools']

    @classmethod
    def get(cls, school_id):
        return SCHOOLS[school_id]

# convert CONFERENCES and SCHOOLS to map to School objects initially
for school_id, school in SCHOOLS.items():
    SCHOOLS[school_id] = School(school_id, school['name'], school['conference'])

for conference in CONFERENCES.values():
    conference['schools'] = [
        School.get(school_id)
        for school_id in conference['schools'].keys()
    ]

class Game(models.Model):
    """
    Stores information about a game's winner, loser, and their respective scores.
    """

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

    def get_record(self, school):
        """Return a tuple of values that store the number of wins and losses"""
        wins = self.games.filter(winner=school.id).count()
        losses = self.games.filter(loser=school.id).count()
        return (wins, losses)

    def get_circle_of_suck(self):
        """
        Returns the circle of suck with School objects
        """
        try:
            circle_of_suck = json.loads(self.circle_of_suck)
        except:
            return []

        return [
            [School.get(school_id) for school_id in cycle]
            for cycle in circle_of_suck
        ]

    def set_circle_of_suck(self, circle_of_suck):
        """
        Set the given circle of suck, as a list of school IDs; see base.constants
        for the list of school IDs (the IDs returned from the API). Still need
        to save to store data in database
        """
        if len(circle_of_suck) == 0:
            self.circle_of_suck = ''
        else:
            if isinstance(circle_of_suck[0][0], School):
                circle_of_suck = [
                    [school.id for school in cycle]
                    for cycle in circle_of_suck
                ]
            self.circle_of_suck = json.dumps(circle_of_suck)
