from django.views.generic import TemplateView

from base.models import *
from base.utils import flatten

class HomeView(TemplateView):
    template_name = "home.html"

class ConferenceView(TemplateView):
    template_name = "conference.html"

    def get_context_data(self, **kwargs):
        context = super(ConferenceView, self).get_context_data(**kwargs)

        context['season'] = self.season
        if self.season:
            context['all_games'] = self.season.games.all()

            circle_of_suck = self.season.get_circle_of_suck()
            context['circle_of_suck'] = circle_of_suck

            # all schools in a circle of suck
            circle_schools = flatten(circle_of_suck)
            all_schools = School.get_conference(self.season.conference)
            # schools not in any circles of suck
            context['extra_schools'] = set(all_schools) - set(circle_schools)

        return context

    def dispatch(self, request, *args, **kwargs):
        sport = request.GET['sport']
        conference = request.GET['conference']
        year = request.GET.get('year')
        try:
            self.season = Season.objects.get(sport=sport, conference=conference)
        except:
            self.season = None
        return super(ConferenceView, self).dispatch(request, *args, **kwargs)
