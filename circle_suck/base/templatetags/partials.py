from __future__ import unicode_literals

from django import template
from django.templatetags.static import static as get_static_path
from django.utils.html import format_html_join

register = template.Library()

@register.simple_tag
def add_style(*paths):
    """
    Add a stylesheet link to the <head> from the given path

    from:
    {% add_style 'base/page_modify.css' %}

    to:
    <link rel="stylesheet" type="text/css" href="{% static 'css/base/page_modify.css' %}>
    """
    return format_html_join(
        '',
        '<link rel="stylesheet" type="text/css" href="{}">',
        [(get_static_path('css/%s' % path),) for path in paths]
    )

@register.simple_tag
def add_script(*paths):
    """
    Add a script to the <head> from the given path

    from:
    {% add_script 'base/page_modify.js' %}

    to:
    <script src="{% static 'js/base/page_modify.js' %}"></script>
    """
    return format_html_join(
        '',
        '<script src="{}"></script>',
        [(get_static_path('js/%s' % path),) for path in paths]
