import { useEffect, useState } from 'react'

import { useData } from './lib/data'
import { CircleOfSuckResult, findCircleOfSuck } from './lib/circleOfSuck'
import { Conference, Game, Team } from './lib/types'
import { Maybe } from './lib/typeutils'

type CircleOfSuckHookResult = {
  loading: boolean
  result: Maybe<CircleOfSuckResult>
}

export const useCircleOfSuck = (year: number, conference: Conference): CircleOfSuckHookResult => {
  const rawData = useData<{ teams: Team[]; games: Game[] }>(`${year}-${conference}.json`)
  const [result, setCircleOfSuck] = useState<CircleOfSuckHookResult>({
    loading: true,
    result: null,
  })

  useEffect(() => {
    if (!rawData) {
      return
    }

    const { teams, games } = rawData

    // Do this as a Promise within useEffect to do the expensive
    // calculation outside the main render loop
    new Promise<Maybe<CircleOfSuckResult>>((resolve) => {
      resolve(findCircleOfSuck(teams, games))
    }).then((result) => {
      setCircleOfSuck({
        loading: false,
        result,
      })
    })
  }, [rawData])

  return result
}
