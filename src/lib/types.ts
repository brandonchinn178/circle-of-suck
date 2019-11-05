export interface Game {
  conference_game: boolean
  away_team: string
  home_team: string
  away_points: number
  home_points: number
}

// api.collegefootballdata.com/conferences
export type Conference
  = 'ACC' // Atlantic Coast Conference
  | 'B12' // Big 12 Conference
  | 'B1G' // Big Ten Conference
  | 'SEC' // Southeastern Conference
  | 'PAC' // Pac-12 Conference
  | 'CUSA' // Conference USA
  | 'MAC' // Mid-American Conference
  | 'MWC' // Mountain West Conference
  | 'Ind' // FBS Independents
  | 'SBC' // Sun Belt Conference
  | 'AAC' // American Athletic Conference
  | 'Western' // Western Conference
  | 'MVIAA' // Missouri Valley Intercollegiate Athletic Association
  | 'RMC' // Rocky Mountain Conference
  | 'SWC' // Southwest Conference
  | 'PCC' // Pacific Coast Conference
  | 'Southern' // Southern Conference
  | 'Big 6' // Big 6 Conference
  | 'MVC' // Missouri Valley Conference
  | 'MSAC' // Mountain State Athletic Conference
  | 'Big 7' // Big 7 Conference
  | 'Skyline' // Skyline Conference
  | 'Ivy' // The Ivy League
  | 'AAWU' // Athletic Association of Western Universities
  | 'Big 8' // Big 8 Conference
  | 'WAC' // Western Athletic Conference
  | 'Pac-8' // Pacific 8 Conference
  | 'PCAA' // Pacific Coast Athletic Association
  | 'Southland' // Southland Conference
  | 'SWAC' // Southwest Athletic Conference
  | 'Pac-10' // Pacific 10
  | 'BW' // Big West Conference
  | 'BE' // Big East Conference
  | 'BIAA' // Border Intercollegiate Athletic Association

export interface Team {
  school: string
  abbreviation: string
}
