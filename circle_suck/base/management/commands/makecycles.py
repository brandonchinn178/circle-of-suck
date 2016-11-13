from django.core.management.base import BaseCommand, CommandError
from base import utils
import datetime
from base.models import *

class Command(BaseCommand):
    help = 'takes game data for every conference and creates circles of suck for each'

    def add_arguments(self, parser):
        parser.add_argument('--year', type=str, default=datetime.datetime.now().year)

    def handle(self, *args, **options):
        self.year = options['year']
        for sport, sport_url in SPORTS_URLS.items():
            self.update_circles(sport, sport_url, **options)
    
    def update_circles(self, sport, sport_url, **options):
    	for conference in CONFERENCES:
    		self.season = Season.objects.get(sport = sport, conference = conference, year = self.year)
    		games = Game.objects.all().filter(season = self.season)
    		graph = {}
    		for school in CONFERENCES[conference]["schools"]:
    			relevant_games = games.filter(loser = school.id)
    			losses = []
    			for game in relevant_games:
    				losses.append(game.winner)
    			graph[school.id] = losses
    		circles = utils.find_all_connected(graph)
    		self.season.set_circle_of_suck(circles)