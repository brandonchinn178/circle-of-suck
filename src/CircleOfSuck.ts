import _ from 'lodash'
import { useEffect, useState } from 'react'

import { useAPI } from './lib/api'
import { getHamiltonian, WeightedDiGraph } from './lib/graph'
import { Conference, Game, Team } from './lib/types'
import { Maybe } from './lib/typeutils'

type CircleOfSuckResult = {
  loading: boolean
  circleOfSuck: Maybe<CircleOfSuckEdge[]>
  teams: Maybe<Team[]>
}

export const useCircleOfSuck = (year: number, conference: Conference): CircleOfSuckResult => {
  const rawData = useAPI<{ teams: Team[]; games: Game[] }>(`${year}-${conference}.json`)
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

type CircleOfSuckEdge = {
  from: Team
  to: Team
  isPlayed: boolean // has this game already been played?
}

const findCircleOfSuck = async (teams: Team[], games: Game[]): Promise<Maybe<CircleOfSuckEdge[]>> => {
  // maps winner team -> loser team
  const gameGraph = _.fromPairs(_.map(teams, ({ school }) => [school, [] as string[]]))

  // contains all future games, as [home_team, away_team] pairs
  const futureGames = [] as [string, string][]

  _.each(games, ({ conference_game, away_team, home_team, away_points, home_points }) => {
    if (!conference_game) {
      return
    }

    if (away_points === null || home_points === null) {
      futureGames.push([home_team, away_team])
    } else if (away_points > home_points) {
      gameGraph[away_team].push(home_team)
    } else {
      gameGraph[home_team].push(away_team)
    }
  })

  const teamToIndex = _.fromPairs(_.map(teams, ({ school }, i) => [school, i]))

  const graph = new WeightedDiGraph(teams.length)
  _.each(gameGraph, (losers, winner) => {
    _.each(losers, (loser) => {
      graph.addEdge(teamToIndex[winner], teamToIndex[loser], 0)
    })
  })
  _.each(futureGames, ([home, away]) => {
    graph.addEdge(teamToIndex[home], teamToIndex[away], 1)
    graph.addEdge(teamToIndex[away], teamToIndex[home], 1)
  })

  const hamiltonian = getHamiltonian(graph)
  if (!hamiltonian) {
    return null
  }

  return _.map(hamiltonian.map((v) => teams[v]), (team1, i, arr) => {
    const team2 = arr[i === arr.length - 1 ? 0 : i + 1]

    return {
      from: team1,
      to: team2,
      isPlayed: _.includes(gameGraph[team1.school], team2.school),
    }
  })
}
