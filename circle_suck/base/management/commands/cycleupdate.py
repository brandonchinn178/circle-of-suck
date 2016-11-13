from django.core.management.base import BaseCommand, CommandError
import os
import requests, datetime

from base.constants import *
from base.models import *

# map sport to url
SPORTS_URLS = {
    'Football': 'ncaafb-t1',
}

API_KEY = os.environ['API_KEY']

class Command(BaseCommand):
    help = 'gathers all game data for specified year (default: current year)'

    def add_arguments(self, parser):
        parser.add_argument('--year', type=str, default=datetime.datetime.now().year)

    def handle(self, *args, **options):
        self.year = options['year']
        for sport, sport_url in SPORTS_URLS.items():
            self.update_api(sport, sport_url, **options)
    
    def update_api(self, sport, sport_url, **options):
        try:
            self.sport = options['--sport']
        except:
            self.sport = "Football"
        url = 'http://api.sportradar.us/'+ sport_url + '/' + str(self.year) + '/REG/schedule.json?api_key=' + API_KEY
        api = requests.get(url).json()
        weeks = api["weeks"]

        #filter out all non-closed games
        for week in weeks:
            games = week["games"]
            for game in games:
                try:
                    if (SCHOOLS[game["home"]].conference != SCHOOLS[game["away"]].conference or game["status"] != "closed"):
                        continue
                    #print(game["home"] + " " + game["away"] + " " + str(game["status"] == "closed"))
                    #check season, then create or use season not yet implemented properly
                    season,_ = Season.objects.get_or_create(year = self.year, sport = self.sport, conference = SCHOOLS[game["home"]].conference)
                    #print("test")
                    winner, loser = None, None
                    if game["home_points"] > game["away_points"]:
                        winner, loser = game["home"], game["away"]
                        winner_score, loser_score = game["home_points"], game["away_points"]
                    else:
                        loser, winner = game["home"], game["away"]
                        winner_score, loser_score = game["away_points"], game["home_points"]
                    # print(game["scheduled"][0:10])
                    Game.objects.get_or_create(season = season, winner = winner, loser = loser, date = game["scheduled"][0:10],
                                               defaults = {'winner_score': winner_score, 'loser_score': loser_score})
                    
                    print(winner + " " + str(winner_score) + " -- " + loser + " " + str(loser_score))
                except KeyError:
                    continue