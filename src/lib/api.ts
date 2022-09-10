import useAxios from 'axios-hooks'

import { Conference, Game, Team } from './types'
import { Maybe } from './typeutils'

export type API = {
  teams: Team[]
  games: Game[]
}

export const useAPI = (year: number, conference: Conference): Maybe<API> => {
  const [{ data }] = useAxios({
    baseURL: 'https://raw.githubusercontent.com/brandonchinn178/circle-of-suck',
    url: `/data/${year}-${conference}.json`,
  })
  return data
}
