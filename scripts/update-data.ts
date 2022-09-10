// Download API data into ./data/

import Axios from 'axios'
import fs from 'fs/promises'
import path from 'path'

import { findCircleOfSuck } from '../src/lib/circleOfSuck'
import {
  getConferenceDataFileName,
  getCircleOfSuckDataFileName,
} from '../src/lib/data'

const API_KEY = process.env.CFBD_API_KEY
if (!API_KEY) {
  throw new Error("CFBD_API_KEY not found")
}

// https://api.collegefootballdata.com/api/docs/?url=/api-docs.json
const axios = Axios.create({
  baseURL: 'https://api.collegefootballdata.com/',
  headers: {
    authorization: `Bearer ${API_KEY}`,
  },
})

const fetchConferenceData = async (year: number, conference: string) => {
  const { data: teams } = await axios.get('/teams', { params: { conference } })
  const { data: games } = await axios.get('/games', { params: { year, conference } })
  return { teams, games }
}

const saveData = async (file: string, data: unknown) => {
  const dest = `./data/${file}`
  const dir = path.dirname(dest)

  try {
      await fs.mkdir(dir)
  } catch (e) {}

  // prettify it for better diffs
  await fs.writeFile(dest, JSON.stringify(data, null, 2))
}

const main = async () => {
  const year = new Date().getFullYear()
  const conferences = ['PAC']

  for (const conference of conferences) {
    console.log(`[${conference} ${year}] Fetching data`)
    const conferenceData = await fetchConferenceData(year, conference)

    console.log(`[${conference} ${year}] Calculating circle of suck`)
    const { teams, games } = conferenceData
    const circleOfSuck = findCircleOfSuck(teams, games)

    console.log(`[${conference} ${year}] Saving data`)
    await saveData(
      getConferenceDataFileName(year, conference),
      conferenceData
    )
    await saveData(
      getCircleOfSuckDataFileName(year, conference),
      circleOfSuck
    )

    console.log(`[${conference} ${year}] Done`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


