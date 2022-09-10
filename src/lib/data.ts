import useAxios from 'axios-hooks'

export type UseDataResult<T> =
  | { loading: true; data: null }
  | { loading: false; data: T }

export const useData = <T>(file: string): UseDataResult<T> => {
  const [{ loading, data }] = useAxios({
    baseURL: 'https://raw.githubusercontent.com/brandonchinn178/circle-of-suck',
    url: `/data/${file}`,
  })
  return {
    loading,
    data: loading ? null : data,
  }
}

export const getConferenceDataFileName = (year: number, conference: string) =>
  `${year}-${conference}.json`

export const getCircleOfSuckDataFileName = (year: number, conference: string) =>
  `${year}-${conference}-circleofsuck.json`
