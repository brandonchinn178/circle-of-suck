from __future__ import unicode_literals

from django import template
from django.templatetags.static import static as get_static_path
from django.utils.html import format_html, format_html_join

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
    )

@register.simple_tag
def make_school(school):
    """
    Make an SVG for a school
    """
    return format_html(
        """
        <svg width="100" height="100" class='school' data-id="{}">
            <image href="{}" x="25" y="25"></image>
            <circle cx="50" cy="50" r="40"></circle>
        </svg>
        """,
        school.id,
        school.logo
    )
