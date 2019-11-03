import axios from 'axios'
import _ from 'lodash'

export type Game = {
  winner: string
  loser: string
}

// api.collegefootballdata.com/conferences
type Conference
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


/**
 * Get games using api.collegefootballdata.com
 *
 * https://api.collegefootballdata.com/api/docs/
 */
export const getGames = async (year: number, conference: Conference): Promise<Game[]> => {
  const { data } = await axios.get(`https://api.collegefootballdata.com/games?year=${year}&conference=${conference}`)
  return _.compact(_.map(data, ({ conference_game, away_team, home_team, away_points, home_points }) => {
    if (!conference_game) {
      return null
    }

    if (away_points > home_points) {
      return {
        winner: away_team,
        loser: home_team,
      }
    } else {
      return {
        winner: home_team,
        loser: away_team,
      }
    }
  }))
}