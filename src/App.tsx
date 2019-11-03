import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'

import { Game, getGames } from './lib/api'
import { getLongestPath } from './lib/graph'

export const App: FC = () => {
  const [games, setGames] = useState<Game[] | null>(null)

  useEffect(() => {
    const fetchGames = async () => {
      setGames(await getGames(2019, 'PAC'))
    }

    fetchGames()
  }, [])

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
