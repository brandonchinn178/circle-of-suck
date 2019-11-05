import _ from 'lodash'
import React, { FC, useEffect, useState } from 'react'
import Graph from 'react-graph-vis'

import { Conference, Game, Team, useGetGames, useGetTeams } from './lib/api'
import { getHamiltonian, WeightedDiGraph } from './lib/graph'

type Props = {
  year: number
  conference: Conference
}

export const CircleOfSuck: FC<Props> = ({ year, conference }) => {
  const games = useGetGames(year, conference)
  const teams = useGetTeams(conference)
  const [{ loading, circleOfSuck }, setCircleOfSuck] = useState({
    loading: true,
    circleOfSuck: null as CircleOfSuckEdge[] | null,
  })

  useEffect(() => {
    if (!games || !teams) {
      return
    }

    findCircleOfSuck(teams, games).then((result) => {
      setCircleOfSuck({
        loading: false,
        circleOfSuck: result,
      })
    })
  }, [games, teams])

  if (!games || !teams || loading) {
    return null
  }

  if (!circleOfSuck) {
    // TODO: find circle of suck with minimum number of schools left out?
    return <p>No possible circle of suck for this season.</p>
  }

  return (
    <Graph
      graph={{
        nodes: teams.map(({ school, abbreviation }) => ({
          id: school,
          label: `${school} (${abbreviation})`,
        })),
        edges: circleOfSuck.map(({ from, to, isPlayed }) => {
          return {
            from: from.school,
            to: to.school,
            width: isPlayed ? 2 : 1,
            dashes: !isPlayed,
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

type CircleOfSuckEdge = {
  from: Team
  to: Team
  isPlayed: boolean // has this game already been played?
}

const findCircleOfSuck = (teams: Team[], games: Game[]): Promise<CircleOfSuckEdge[] | null> =>
  new Promise((resolve) => {
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

    resolve(_.map(hamiltonian.map((v) => teams[v]), (team1, i, arr) => {
      const team2 = arr[i === arr.length - 1 ? 0 : i + 1]

      return {
        from: team1,
        to: team2,
        isPlayed: _.includes(gameGraph[team1.school], team2.school),
      }
    }))
  })
