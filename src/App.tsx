import React, { FC, useState } from 'react'
import Graph from 'react-graph-vis'

import { Conference } from './lib/api'
import { useCircleOfSuck } from './CircleOfSuck'

// year should initially be the year of the last fall season
const NOW = new Date()
const INITIAL_YEAR = NOW.getFullYear() - (NOW.getMonth() < 6 ? -1 : 0)

export const App: FC = () => {
  // TODO: make inputtable by user
  const [year] = useState(INITIAL_YEAR)

  return (
    <main>
      <h1>PAC-12 Circle of Suck ({year})</h1>
      <CircleOfSuck year={year} conference="PAC" />
    </main>
  )
}

const CircleOfSuck: FC<{ year: number; conference: Conference }> = ({ year, conference }) => {
  const { loading, circleOfSuck, teams } = useCircleOfSuck(year, conference)

  if (loading) {
    return <p>Loading...</p>
  }

  if (circleOfSuck === null) {
    // TODO: show some other interesting graph
    return <p>No possible circle of suck for this season.</p>
  }

  return (
    <Graph
      graph={{
        nodes: teams!.map(({ school, abbreviation }) => ({
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
