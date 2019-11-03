import _ from 'lodash'
import React, { FC } from 'react'

import { useGetGames, useGetTeams } from './lib/api'
import { getLongestPath } from './lib/graph'

export const App: FC = () => {
  const games = useGetGames(2019, 'PAC')
  const teams = useGetTeams('PAC')

  if (!games || !teams) {
    return null
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
      <ul>
        {pathOfSuck.map((team) =>
          <li key={team}>{team}</li>
        )}
      </ul>
      <p>Remaining teams:</p>
      <ul>
        {leftOutTeams.map((team) =>
          <li key={team.abbreviation}>{team.school}</li>
        )}
      </ul>
    </div>
  )
}
