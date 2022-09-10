import { useEffect, useState } from 'react'

import { useData } from './lib/data'
import { CircleOfSuckEdge, findCircleOfSuck } from './lib/circleOfSuck'
import { Conference, Game, Team } from './lib/types'
import { Maybe } from './lib/typeutils'

type CircleOfSuckResult = {
  loading: boolean
  circleOfSuck: Maybe<CircleOfSuckEdge[]>
  teams: Maybe<Team[]>
}

export const useCircleOfSuck = (year: number, conference: Conference): CircleOfSuckResult => {
  const rawData = useData<{ teams: Team[]; games: Game[] }>(`${year}-${conference}.json`)
  const [result, setCircleOfSuck] = useState<CircleOfSuckResult>({
    loading: true,
    circleOfSuck: null,
    teams: null,
  })

  useEffect(() => {
    if (!rawData) {
      return
    }

    const { teams, games } = rawData

    findCircleOfSuck(teams, games).then((result) => {
      setCircleOfSuck({
        loading: false,
        circleOfSuck: result,
        teams,
      })
    })
  }, [rawData])

  return result
}
