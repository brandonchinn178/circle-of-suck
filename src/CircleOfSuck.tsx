import _ from 'lodash'
import React, { FC } from 'react'
import Graph from 'react-graph-vis'

import { Conference, useGetGames, useGetTeams } from './lib/api'
import { getHamiltonian, WeightedDiGraph } from './lib/graph'

type Props = {
  year: number
  conference: Conference
}

export const CircleOfSuck: FC<Props> = ({ year, conference }) => {
  const games = useGetGames(year, conference)
  const teams = useGetTeams(conference)

  if (!games || !teams) {
    return null
  }

  const teamToIndex = _.fromPairs(_.map(teams, ({ school }, i) => [school, i]))

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

  // find a hamiltonian cycle if possible, otherwise find the current longest path of suck
  const hamiltonian = getHamiltonian(graph)
  if (!hamiltonian) {
    // TODO: find circle of suck with minimum number of schools left out?
    return <p>No possible circle of suck for this season.</p>
  }

  const circleOfSuck = hamiltonian.map((v) => teams[v])
  const circleOfSuckEdges = _.compact(_.map(circleOfSuck, (team, i) => {
    const next = i === circleOfSuck.length - 1 ? 0 : i + 1
    return [team, circleOfSuck[next]]
  }))

  return (
    <Graph
      graph={{
        nodes: teams.map(({ school, abbreviation }) => ({
          id: school,
          label: `${school} (${abbreviation})`,
        })),
        edges: circleOfSuckEdges.map(([{ school: team1 }, { school: team2 }]) => {
          const isFinal = _.includes(gameGraph[team1], team2)

          return {
            from: team1,
            to: team2,
            width: isFinal ? 2 : 1,
            dashes: !isFinal,
          }
        })
      }}
      options={{
        height: '600px',
        physics: {
          enabled: false,
        },
      }}
    />
  )
}
