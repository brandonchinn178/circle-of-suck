import _ from 'lodash'

import { getHamiltonian, WeightedDiGraph } from './graph'
import { Game, Team, TeamAbbreviation } from './types'
import { Maybe } from './typeutils'

export type CircleOfSuckResult = null | {
  circleOfSuck: CircleOfSuckEdge[]
  teams: Team[]
}

export type CircleOfSuckEdge = {
  from: TeamAbbreviation
  to: TeamAbbreviation
  isPlayed: boolean // has this game already been played?
}

export const findCircleOfSuck = (teams: Team[], games: Game[]): CircleOfSuckResult => {
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

  const circleOfSuck = _.map(hamiltonian.map((v) => teams[v]), (team1, i, arr) => {
    const team2 = arr[i === arr.length - 1 ? 0 : i + 1]

    return {
      from: team1.abbreviation,
      to: team2.abbreviation,
      isPlayed: _.includes(gameGraph[team1.school], team2.school),
    }
  })

  return { circleOfSuck, teams }
}
