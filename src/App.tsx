import _ from 'lodash'
import React, { FC } from 'react'

import { Game, getGames, useAPI } from './lib/api'
import { getLongestPath } from './lib/graph'

export const App: FC = () => {
  const games = useAPI(getGames, 2019, 'PAC')

  if (!games) {
    return null
  }

  const gameGraph = {}
  _.each(games, ({ winner, loser }) => {
    _.merge(gameGraph, { [winner]: [loser] })
  })
  const pathOfSuck = getLongestPath(gameGraph)

  return (
    <ul>
      {pathOfSuck.map((team) =>
        <li key={team}>{team}</li>
      )}
    </ul>
  )
}
