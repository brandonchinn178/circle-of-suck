from base.utils import merge_dicts

# list of sports
SPORTS = [
    "football",
]

# map ID to team name. Add logo image to `img/<conference_id>/<school_id>.png` (lowercase IDs)
PAC_12 = {
    'CAL': 'Cal Golden Bears',
    'UCLA': 'UCLA Bruins',
    'COL': 'Colorado Buffaloes',
    'ASU': 'ASU Sun Devils',
    'USC': 'USC Trojans',
    'UTH': 'Utah Utes',
    'ARI': 'Arizona Wildcats',
    'ORS': 'OSU Beavers',
    'STA': 'Stanford Cardinal',
    'WST': 'Washington State Cougars',
    'ORE': 'Oregon Ducks',
    'WAS': 'Washington Huskies',
}

# map ID to conference name and dictionary of schools
CONFERENCES = {
    'PAC_12': {
        'name': 'Pac-12',
        'schools': PAC_12,
    },
    # add other conferences here
}

# map ID to team name and conference ID
SCHOOLS = merge_dicts(*[
    {
        school_id: {
            'name': school,
            'conference': conference_id,
        }
        for school_id, school in conference['schools'].items()
    }
    for conference_id, conference in CONFERENCES.items()
])
