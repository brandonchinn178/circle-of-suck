import useAxios from 'axios-hooks'

import { Maybe } from './typeutils'

export const useData = <T>(file: string): Maybe<T> => {
  const [{ data }] = useAxios({
    baseURL: 'https://raw.githubusercontent.com/brandonchinn178/circle-of-suck',
    url: `/data/${file}`,
  })
  return data
}
