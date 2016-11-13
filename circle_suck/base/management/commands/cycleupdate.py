from django.core.management.base import BaseCommand, CommandError
import os
import requests, datetime

from base.constants import *
from base.models import *

API_KEYS = {
    "Football": os.environ['API_KEY_NCAAFB'],
    "Men's Basketball": os.environ['API_KEY_NCAAMB'],
    "Women's Basketball": os.environ['API_KEY_NCAAWB'],
}

class Command(BaseCommand):
    help = 'gathers all game data for specified year (default: current year)'

    def add_arguments(self, parser):
        parser.add_argument('--year', type=str, default=datetime.datetime.now().year)

    def handle(self, *args, **options):
        self.year = options['year']
        for sport in SPORTS:
            print 'Running for %s...' % sport
            self.update_api(sport, sport_url, **options)
        print 'done.'
    
    def update_api(self, sport, **options):
        sport_url = SPORTS_URLS[sport]
        api_key = API_KEYS[sport]
        url = 'http://api.sportradar.us/'+ sport_url + '/' + str(self.year) + '/REG/schedule.json?api_key=' + api_key
        api = requests.get(url).json()
        weeks = api["weeks"]

        #filter out all non-closed games
        for week in weeks:
            games = week["games"]
            for game in games:
                try:
                    if (SCHOOLS[game["home"]].conference != SCHOOLS[game["away"]].conference or game["status"] != "closed"):
                        continue
                    #check season, then create or use season not yet implemented properly
                    season,_ = Season.objects.get_or_create(year = self.year, sport = sport, conference = SCHOOLS[game["home"]].conference)
                    winner, loser = None, None
                    if game["home_points"] > game["away_points"]:
                        winner, loser = game["home"], game["away"]
                        winner_score, loser_score = game["home_points"], game["away_points"]
                    else:
                        loser, winner = game["home"], game["away"]
                        winner_score, loser_score = game["away_points"], game["home_points"]
                    Game.objects.get_or_create(season = season, winner = winner, loser = loser, date = game["scheduled"][0:10],
                                               defaults = {'winner_score': winner_score, 'loser_score': loser_score})
                except KeyError:
                    continue