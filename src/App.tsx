import _ from 'lodash'
import React, { FC, useState } from 'react'
import Graph from 'react-graph-vis'

import { CircleOfSuckResult } from './lib/circleOfSuck'
import { getCircleOfSuckDataFileName, useData } from './lib/data'
import { Conference } from './lib/types'

const NOW = new Date()
const FIRST_YEAR = 2021 // the first year we have data for
const LATEST_FALL_YEAR = NOW.getFullYear() + (NOW.getMonth() < 6 ? -1 : 0)
const ALL_YEARS = _.rangeRight(FIRST_YEAR, LATEST_FALL_YEAR + 1)

export const App: FC = () => {
  const [year, setYear] = useState(LATEST_FALL_YEAR)

  return (
    <main>
      <h1>PAC-12 Circle of Suck ({year})</h1>
      <div>
        <label>Check out a different year: </label>
        <select onChange={(e) => setYear(_.parseInt(e.target.value))}>
          {ALL_YEARS.map((year, i) => <option key={i} value={year}>{year}</option>)}
        </select>
      </div>
      <CircleOfSuck year={year} conference="PAC" />
    </main>
  )
}

const CircleOfSuck: FC<{ year: number; conference: Conference }> = ({ year, conference }) => {
  const circleOfSuckFile = getCircleOfSuckDataFileName(year, conference)
  const { loading, data } = useData<CircleOfSuckResult>(circleOfSuckFile)

  if (loading) {
    return <p>Loading...</p>
  }

  if (!data) {
    // TODO: show some other interesting graph
    return <p>No possible circle of suck for this season.</p>
  }

  const { circleOfSuck, teams } = data
  const isComplete = _.every(circleOfSuck, 'isPlayed')

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
      <Graph
        graph={{
          nodes: teams.map(({ school, abbreviation }) => ({
            id: abbreviation,
            label: `${school} (${abbreviation})`,
          })),
          edges: circleOfSuck.map(({ from, to, isPlayed }) => {
            return {
              from,
              to,
              width: isPlayed ? 2 : 1,
              dashes: !isPlayed,
            }
          })
        }}
        options={{
          height: '500px',
          physics: {
            enabled: false,
          },
        }}
      />
    </>
  )
}
