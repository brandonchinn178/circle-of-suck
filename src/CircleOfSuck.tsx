import { Graphviz } from 'graphviz-react'
import jsgraphs from 'js-graph-algorithms'
import _ from 'lodash'
import React, { FC } from 'react'

import { Conference, Team, useGetGames, useGetTeams } from './lib/api'
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
  const gameGraph = new jsgraphs.DiGraph(teams.length)
  _.each(games, ({ conference_game, away_team, home_team, away_points, home_points }) => {
    if (!conference_game) {
      return
    }

    const away = teamToIndex[away_team]
    const home = teamToIndex[home_team]

    if (away_points > home_points) {
      gameGraph.addEdge(away, home)
    } else {
      gameGraph.addEdge(home, away)
    }
  })

  // find a hamiltonian cycle if possible, otherwise find the current longest path of suck
  const hamiltonian = _.map(getHamiltonian(gameGraph), (v) => teams[v])
  const longest = _.map(getLongestPath(gameGraph), (v) => teams[v])
  const circleOfSuck = hamiltonian || longest
  const circleOfSuckEdges = pairify(circleOfSuck)
  if (hamiltonian) {
    circleOfSuckEdges.push([_.last(hamiltonian) as Team, hamiltonian[0]])
  }

  return (
    <Graphviz
      dot={`digraph {
        ${teams.map((team) => `"${teamName(team)}";`).join(' ')}
        ${circleOfSuckEdges.map(([team1, team2]) => `"${teamName(team1)}" -> "${teamName(team2)}";`).join(' ')}
      }`}
      options={{
        width: '100%',
        height: '600px',
      }}
    />
  )
}

const teamName = (team: Team): string => `${team.school} (${team.abbreviation})`

// pairify([1,2,3,4]) => [[1,2],[2,3],[3,4]]
const pairify = <T,>(arr: T[]): [T, T][] =>
  _.zip(_.dropRight(arr, 1), _.drop(arr, 1)) as [T, T][]
