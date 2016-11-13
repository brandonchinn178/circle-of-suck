from base.utils import merge_dicts

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

ACC = {
    'BC': 'Boston College Eagles',
    'CLE': 'Clemson Tigers',
    'FSU': 'FSU Seminoles',
    'LOU': 'Louisville Cardinals',
    'NCST': 'NC State Wolfpack',
    'SYR': 'Syracuse Orange',
    'WF': 'Wake Forest Demon Deacons',
    'DUK': 'Duke Blue Devils',
    'GT': 'Georgia Tech Yellow Jackets',
    'MFL': 'Miami Hurricanes',
    'NC': 'UNC Tarheels',
    'PIT': 'Pitt Panthers',
    'UVA': 'Virgina Cavaliers',
    'VT': 'VT Hokies',
}

BIG_TEN = {
    'IU': "Indiana Hoosiers",
    'MAR': "Maryland Terrapins",
    'MICH': "Michigan Wolverines",
    'MSU': "Michigan State Spartans",
    'OSU': "Ohio State Buckeyes",
    'PSU': "Penn State Nittany Lions",
    'RUT': "Rutgers Scarlet Knights",
    'ILL': "Illinois Fighting Illini",
    'IOW': "Iowa Hawkeyes",
    'MIN': "Minnesota Golden Gophers",
    'NEB': "Nebraska Cornhuskers",
    'NW': "Northwestern Wildcats",
    'PUR': "Boilermakers",
    'WIS': "Badgers",
}

# map ID to conference name and dictionary of schools
CONFERENCES = {
    'PAC_12': {
        'name': 'Pac-12',
        'schools': PAC_12,
    },
    'ACC': {
        'name': 'ACC',
        'schools': ACC,
    },
    'BIG-TEN': {
        'name': 'Big Ten',
        'schools': BIG_TEN,
    },
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
