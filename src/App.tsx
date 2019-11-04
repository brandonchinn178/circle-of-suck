import React, { FC } from 'react'

import { CircleOfSuck } from './CircleOfSuck'

export const App: FC = () => {
  return (
    <main>
      <h1>PAC-12 Circle of Suck</h1>
      <CircleOfSuck year={2019} conference="PAC" />
    </main>
  )
}
