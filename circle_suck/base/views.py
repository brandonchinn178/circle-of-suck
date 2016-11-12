from django.views.generic import TemplateView
from django.shortcuts import redirect

from base.models import *
from base.utils import flatten

class HomeView(TemplateView):
    template_name = "home.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['sports'] = SPORTS
        context['conferences'] = CONFERENCES
        return context

class ConferenceView(TemplateView):
    template_name = "conference.html"

    def get_context_data(self, **kwargs):
        context = super(ConferenceView, self).get_context_data(**kwargs)

        context['season'] = self.season
        if self.season:
            context['all_games'] = [
                {
                    'winner': game.winner,
                    'loser': game.loser,
                    'winner_score': game.winner_score,
                    'loser_score': game.loser_score,
                    'date': game.date,
                }
                for game in self.season.games.all()
            ]

            circles_of_suck = self.season.get_circle_of_suck()
            context['circles_of_suck'] = circles_of_suck

            # all schools in a circle of suck
            circle_schools = flatten(circles_of_suck)
            # all schools in conference
            all_schools = School.get_conference(self.season.conference)
            # schools not in any circles of suck
            context['extra_schools'] = set(all_schools) - set(circle_schools)

        return context

    def dispatch(self, request, *args, **kwargs):
        try:
            kwargs = {
                'sport': request.GET['sport'],
                'conference': request.GET['conference'],
            }
        except:
            return redirect('home')

        if 'year' in request.GET:
            kwargs['year'] = request.GET['year']

        try:
            self.season = Season.objects.get(**kwargs)
        except:
            self.season = None

        return super(ConferenceView, self).dispatch(request, *args, **kwargs)
