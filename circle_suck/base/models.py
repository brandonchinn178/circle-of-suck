from __future__ import unicode_literals

from django.conf import settings
from django.db import models

from base.constants import *
import requests, json

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

class Game(object):
    """
    Stores information about a game's winner, loser, and their respective scores.
    """

    def __init__(self, first_school_id, second_school_id, season):
        data = self.get_game_data(first_school_id, second_school_id, season)
        home = data["home_team"]
        away = data["away_team"]

        if home["points"] > away["points"]:
            winner = home["market"]
            loser = away["market"]
            winner_score = home["points"]
            loser_score = away["points"]
        else:
            winner = away["market"]
            loser = home["market"]
            winner_score = away["points"]
            loser_score = home["points"]

        self.winner = winner
        self.loser = loser
        self.winner_score = winner_score
        self.loser_score = loser_score
        self.season = season
        self.date = data["scheduled"]

    def get_game_data(self, first_school_id, second_school_id, season):
        """
        Helper to init function to grab game data.
        """
        year = season.year
        url = "https://api.sportradar.us/ncaafb-t1/%f/REG/schedule.json" % (year,)
        r = requests.get(url, params={"api_key": API_KEY})
        data = r.json()
        for week in data["weeks"]:
            for game in week['games']:
                if (game["home"] == first_school_id && game["away"] == second_school_id) || (game["home"] == second_school_id && game["away"] == first_school_id):
                    url = "https://api.sportradar.us/ncaafb-t1/%d/REG/%d/%s/%s/summary.json" % (year, week["number"], game["away"], game["home"],)
                    r = requests.get(url, params={"api_key": API_KEY})
                    return r.json()

class Season(models.Model):
    """
    Contains a circle of suck for a given year and conference.
    """

    sport = models.ChoiceField(choices=SPORTS)
    conference = model.ChoiceField(choices=CONFERENCES.keys())
    year = model.IntegerField(min_value=1915, max_value=2016)
    circle_of_suck = models.TextField()

