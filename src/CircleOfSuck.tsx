import jsgraphs from 'js-graph-algorithms'
import _ from 'lodash'
import React, { FC } from 'react'
import Graph from 'react-graph-vis'

import { Conference, useGetGames, useGetTeams } from './lib/api'
import { getHamiltonian, getLongestPath } from './lib/graph'

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
  _.each(games, ({ conference_game, away_team, home_team, away_points, home_points }) => {
    if (!conference_game || away_points === null || home_points === null) {
      return
    }

    if (away_points > home_points) {
      gameGraph[away_team].push(home_team)
    } else {
      gameGraph[home_team].push(away_team)
    }
  })

  const graph = new jsgraphs.DiGraph(teams.length)
  _.each(gameGraph, (losers, winner) => {
    _.each(losers, (loser) => {
      graph.addEdge(teamToIndex[winner], teamToIndex[loser])
    })
  })

  // find a hamiltonian cycle if possible, otherwise find the current longest path of suck
  const hamiltonian = getHamiltonian(graph)
  const circleOfSuck = (hamiltonian || getLongestPath(graph)).map((v) => teams[v])
  const circleOfSuckEdges = _.compact(_.map(circleOfSuck, (team, i) =>{
    if (i === circleOfSuck.length - 1 && hamiltonian === null) {
      return
    }

    return [team, circleOfSuck[i + 1]]
  }))

  return (
    <Graph
      graph={{
        nodes: teams.map(({ school, abbreviation }) => ({
          id: school,
          label: `${school} (${abbreviation})`,
        })),
        edges: circleOfSuckEdges.map(([team1, team2]) => ({
          from: team1.school,
          to: team2.school,
          width: 2,
        }))
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
