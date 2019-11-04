import { Graphviz } from 'graphviz-react'
import _ from 'lodash'
import React, { FC } from 'react'

import { Conference, Team, useGetGames, useGetTeams } from './lib/api'
import { getLongestPath } from './lib/graph'

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

  const getTeam = (school: string): Team => {
    const team = _.find(teams, { school })
    if (!team) {
      throw new Error(`Could not find team: ${school}`)
    }
    return team
  }

  // maps winner team -> loser team
  const gameGraph = _.fromPairs(_.map(teams, (team) => [team.school, [] as string[]]))
  _.each(games, ({ conference_game, away_team, home_team, away_points, home_points }) => {
    if (!conference_game) {
      return
    }

    if (away_points > home_points) {
      gameGraph[away_team].push(home_team)
    } else {
      gameGraph[home_team].push(away_team)
    }
  })

  const pathOfSuck = getLongestPath(gameGraph).map(getTeam)

  return (
    <div>
      <h1>PAC-12 Circle of Suck</h1>
      <Graphviz
        dot={`digraph {
          ${teams.map((team) => `"${teamName(team)}";`).join(' ')}
          ${pairify(pathOfSuck).map(([team1, team2]) => `"${teamName(team1)}" -> "${teamName(team2)}";`).join(' ')}
        }`}
        options={{
          width: '100%',
          height: '600px',
        }}
      />
    </div>
  )
}

const teamName = (team: Team): string => `${team.school} (${team.abbreviation})`

// pairify([1,2,3,4]) => [[1,2],[2,3],[3,4]]
const pairify = <T,>(arr: T[]): [T, T][] =>
  _.zip(_.dropRight(arr, 1), _.drop(arr, 1)) as [T, T][]
