Circle of Suck
==============

**Cal Hacks 2016**

A "circle of suck" is a cycle of college sports teams, where each team has an arrow pointing to a team they have lost to in the sport. Hopefully, at some point in the season, a full circle can be found, where each team has lost to some other team in the conference.

This website scrapes data from [Sportradar](http://developer.sportradar.com/) with college sports scores and run a cycle-finding algorithm to find a circle of suck (or at least, the longest circles of suck).

Team
----

- [@brandonchinn178](http://github.com/brandonchinn178): Project Leader, Front-end design & development
- [@allanwlevy](http://github.com/allanwlevy): Back-end development, longest-cycle algorithm
- [@matt-trinh](http://github.com/matt-trinh): Back-end development, API research
- [@leslietsai](http://github.com/leslietsai): Front-end design & development
- [@thomasgreen](http://github.com/thomasgreen): Longest-cycle algorithm, API scraping

Installation
------------

1. `git clone` this repository
1. Install the requirements in `dev_requirements.txt` in your favorite virtual environment (if you use `virtualenv`, name the directory `venv/`). You can do this with `pip install -r dev_requirements.txt`
1. Get the `.env` file from someone, run `source .env`
1. Run `python circle_suck/manage.py migrate`
1. Run `npm install` and `grunt build` (Requires Node.js and Sass)
1. Run `python circle_suck/manage.py runserver`
1. Go to `http://localhost:8000`

Testing
-------

1. `cd circle_suck`
1. `python manage.py test`
