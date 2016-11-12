from django.views.generic import TemplateView
from base.models import *
class HomeView(TemplateView):
    template_name = "home.html"

class ConferenceView(TemplateView):
    template_name = "conference.html"

    def get_context_data(self, **kwargs):
        context = super(ConferenceView, self).get_context_data(**kwargs)
        context['schools'] = School.get_conference("PAC_12")
        return context

