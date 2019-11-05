import Axios from 'axios'
import useAxios, { configure } from 'axios-hooks'

import { Conference, Game, Team } from './types'
import { Maybe } from './typeutils'

export const useGetTeams = (conference: Conference): Maybe<Team[]> => {
  return useAPI<Team[]>('/teams', { conference })
}

export const useGetGames = (year: number, conference: Conference): Maybe<Game[]> => {
  return useAPI<Game[]>('/games', { year, conference })
}

// https://api.collegefootballdata.com/api/docs/
const axios = Axios.create({
  baseURL: 'https://api.collegefootballdata.com/',
})

configure({ axios })

export const useAPI = <T>(url: string, params: object): Maybe<T> => {
  const [{ data }] = useAxios({ url, params })
  return data
}
