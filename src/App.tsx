import React, { FC } from 'react'

import { CircleOfSuck } from './CircleOfSuck'

export const App: FC = () => {
  return (
    <main>
      <CircleOfSuck year={2019} conference="PAC" />
    </main>
  )
}
