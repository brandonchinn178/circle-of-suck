import _ from 'lodash'
import React, { FC, useState } from 'react'
import Graph from 'react-graph-vis'

import { Conference } from './lib/types'
import { useCircleOfSuck } from './CircleOfSuck'

// year should initially be the year of the last fall season
const NOW = new Date()
const INITIAL_YEAR = NOW.getFullYear() + (NOW.getMonth() < 6 ? -1 : 0)
const PREVIOUS_YEARS = Array.from(new Array(20), (val, index) => INITIAL_YEAR - index)

export const App: FC = () => {
  // TODO: make inputtable by user
  const [year, setYear] = useState(INITIAL_YEAR)
  const [circleOfSuck, setCircleOfSuck] = useState(<CircleOfSuck year={year} conference="PAC" />)

  return (
    <main>
      <h1>PAC-12 Circle of Suck</h1>
      <select value={year} onChange={(event) => {
        setYear(parseInt(event.target.value))
        setCircleOfSuck(<CircleOfSuck year={parseInt(event.target.value)} conference="PAC" />)
      }}>
        {
          PREVIOUS_YEARS.map((year, index) => {
            return <option key={`year${index}`} value={year}>{year}</option>
          })
        }
      </select>
      {circleOfSuck}
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

  const isComplete = _.every(circleOfSuck, 'isPlayed')
  const graph = {
    nodes: teams!.map(({ school, abbreviation, color }) => {
      return {
        id: school,
        label: `${school} (${abbreviation})`,
        fixed: false,
        color: color,
        font: {
          color: "#FFFFFF"
        }
    }
    }),
    edges: circleOfSuck.map(({ from, to, isPlayed }) => {
      return {
        from: from.school,
        to: to.school,
        width: isPlayed ? 2 : 1,
        dashes: !isPlayed
      }
    })
  }
  const options = {
    height: '500px',
    physics: {
      enabled: false
    },
    autoResize: true  
  }

  var component = <Graph
    graph={graph}
    options={options}
    getNetwork={(network:any)=>{network.redraw()}}
  />

  return (
    <>
      {!isComplete && (
        <p>
          No complete circle of suck was found. Displaying a possible circle of
          suck.
        </p>
      )}
      <p>
        An arrow from school A to school B represents a game where school A
        beats school B.
      </p>
      {!isComplete && (
        <p>
          A dashed arrow from school A to school B represent a future game
          that could complete the circle of suck, if school A beats school B.
        </p>
      )}
      {component}
    </>
  )
}
