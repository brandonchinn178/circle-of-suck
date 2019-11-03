import _ from 'lodash'
import React, { FC } from 'react'

import { Team, useGetGames, useGetTeams } from './lib/api'
import { getLongestPath } from './lib/graph'

export const App: FC = () => {
  const games = useGetGames(2019, 'PAC')
  const teams = useGetTeams('PAC')

  if (!games || !teams) {
    return null
  }

  const getTeam = (school: string): Team => {
    const team = _.find(teams, { school })
    if (!team) {
      throw new Error(`Could not find team: ${school}`)
    }
    return team
  }

  // maps winner team -> loser team
  const gameGraph = {}
  _.each(games, ({ conference_game, away_team, home_team, away_points, home_points }) => {
    if (!conference_game) {
      return
    }

    const game = away_points > home_points ? { [away_team]: [home_team] } : { [home_team]: [away_team] }
    _.merge(gameGraph, game)
  })

  const pathOfSuck = getLongestPath(gameGraph)

  const leftOutTeams = _.filter(teams, (team) => !_.includes(pathOfSuck, team.school))

  return (
    <div>
      <p>Circle of suck:</p>
      <TeamList teams={pathOfSuck.map(getTeam)} />
      <p>Remaining teams:</p>
      <TeamList teams={leftOutTeams} />
    </div>
  )
}

const TeamList: FC<{ teams: Team[] }> = ({ teams }) => (
  <ul>
    {teams.map(({ abbreviation, school }) =>
      <li key={abbreviation}>{school} ({abbreviation})</li>
    )}
  </ul>
)
