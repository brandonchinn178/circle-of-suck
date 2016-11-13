from django.core.management.base import BaseCommand, CommandError
from base import utils
import datetime
from base.models import *

class Command(BaseCommand):
    help = 'takes game data for every conference and creates circles of suck for each'

    def add_arguments(self, parser):
        parser.add_argument('--year', type=str, default=datetime.datetime.now().year)

    def handle(self, *args, **options):
        year = options['year']

        for conference_id, conference in CONFERENCES.items():
            print '    - %s...' % conference['name']
            season = Season.objects.get(conference = conference_id, year = year)
            games = Game.objects.all().filter(season = season)
            graph = {
                school.id: games.filter(loser=school.id).values_list('winner', flat=True)
                for school in conference['schools']
            }
            circles = utils.find_cycles(graph)
            season.set_circle_of_suck(circles)
            season.save()
