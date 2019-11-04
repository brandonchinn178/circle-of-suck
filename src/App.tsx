import React, { FC } from 'react'

import { CircleOfSuck } from './CircleOfSuck'

export const App: FC = () => {
  // TODO: make inputtable by user
  const date = new Date()
  // year should initially be the year of the last fall season
  const year = date.getFullYear() - (date.getMonth() < 6 ? -1 : 0)

  return (
    <main>
      <h1>PAC-12 Circle of Suck ({year})</h1>
      <CircleOfSuck year={2019} conference="PAC" />
    </main>
  )
}
