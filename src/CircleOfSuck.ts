import _ from 'lodash'
import { useEffect, useState } from 'react'

import { useGetGames, useGetTeams } from './lib/api'
import { getHamiltonian, WeightedDiGraph } from './lib/graph'
import { Conference, Game, Team } from './lib/types'
import { Maybe } from './lib/typeutils'

type CircleOfSuckResult = {
  loading: boolean
  circleOfSuck: Maybe<CircleOfSuckEdge[]>
  teams: Maybe<Team[]>
}

export const useCircleOfSuck = (year: number, conference: Conference): CircleOfSuckResult => {
  const games = useGetGames(year, conference)
  const teams = useGetTeams(conference)
  const [result, setCircleOfSuck] = useState<CircleOfSuckResult>({
    loading: true,
    circleOfSuck: null,
    teams: null,
  })

  useEffect(() => {
    if (!games || !teams) {
      return
    }

    findCircleOfSuck(teams, games).then((result) => {
      setCircleOfSuck({
        loading: false,
        circleOfSuck: result,
        teams,
      })
    })
  }, [games, teams])

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

  // Spacing of the teams should be 360 degrees divided by the number of teams
  const degree_spacing = 360 / teams.length
  console.log(`${degree_spacing}`)
  // TODO: Should calculate this somehow based on the number of teams/the size of the screen
  const radius = 300
  const pi = Math.PI
  return _.map(hamiltonian.map((v) => teams[v]), (team1, i, arr) => {
    const team2 = arr[i === arr.length - 1 ? 0 : i + 1]
    // Multiply the spacing by the index + 1 and convert ot radians
    var radians = (degree_spacing * (i+1)) * (pi/180)
    // Calculate the x and y coordinates. x = radius x cos(radians), y = radius x sin(radians)
    const team1_x = radius * Math.cos(radians)
    const team1_y = radius * Math.sin(radians)
    team1.x_position = team1_x
    team1.y_position = team1_y
    return {
      from: team1,
      to: team2,
      isPlayed: _.includes(gameGraph[team1.school], team2.school),
    }
  })
}
