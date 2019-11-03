import React, { FC, useEffect, useState } from 'react'

import { Game, getGames } from './lib/api'

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

  return <p>{JSON.stringify(games)}</p>
}
