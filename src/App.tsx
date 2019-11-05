import React, { FC, useState } from 'react'

import { CircleOfSuck } from './CircleOfSuck'

// year should initially be the year of the last fall season
const NOW = new Date()
const INITIAL_YEAR = NOW.getFullYear() - (NOW.getMonth() < 6 ? -1 : 0)

export const App: FC = () => {
  // TODO: make inputtable by user
  const [year] = useState(INITIAL_YEAR)

  return (
    <main>
      <h1>PAC-12 Circle of Suck ({year})</h1>
      <CircleOfSuck year={2019} conference="PAC" />
    </main>
  )
}
