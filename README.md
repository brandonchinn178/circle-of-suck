Circle of Suck
==============

**Cal Hacks 2016**

A "circle of suck" is a cycle of college sports teams, where each team has an arrow pointing to a team they have lost to in the sport. Hopefully, at some point in the season, a full circle can be found, where each team has lost to some other team in the conference.

This website will scrape an API with college sports scores and run a cycle-finding algorithm to find a circle of suck (or at least, the longest circles of suck).

Team
----

- Brandon Chinn: Project Leader, Front-end Design
- Allan Levy: Back-end development, longest-cycle algorithm
- Matt Trinh: Back-end development, longest-cycle algorithm
- Leslie Tsai: Front-end development
- Thomas Zhang: Back-end development, longest-cycle-algorithm

Installation
------------

1. `git clone` this repository
1. Install the requirements in `dev_requirements.txt` in your favorite virtual environment (if you use `virtualenv`, name the directory `venv/`). You can do this with `pip install -r dev_requirements.txt`
1. Get the `.env` file from someone, run `source .env`
1. Run `python circle_suck/manage.py migrate`
1. Run `npm install` and `grunt build` (Requires Node.js and Sass)
1. Run `python circle_suck/manage.py runserver`
1. Go to `http://localhost:8000`
