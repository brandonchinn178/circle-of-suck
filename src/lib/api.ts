import Axios from 'axios'
import useAxios, { configure } from 'axios-hooks'

import { Conference, Game, Team } from './types'
import { Maybe } from './typeutils'

const axios = Axios.create({
  baseURL: 'https://raw.githubusercontent.com/brandonchinn178/circle-of-suck',
})

configure({ axios })

export type API = {
  teams: Team[]
  games: Game[]
}

export const useAPI = (year: number, conference: Conference): Maybe<API> => {
  const [{ data }] = useAxios({
    url: `/data/${year}-${conference}.json`,
  })
  return data
}
