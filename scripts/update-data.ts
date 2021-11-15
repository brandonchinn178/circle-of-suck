// Download API data into ./data/

import Axios from 'axios'
import fs from 'fs/promises'
import path from 'path'

const API_KEY = process.env.CFDB_API_KEY
if (!API_KEY) {
  throw new Error("CFDB_API_KEY not found")
}

// https://api.collegefootballdata.com/api/docs/?url=/api-docs.json
const axios = Axios.create({
  baseURL: 'https://api.collegefootballdata.com/',
  headers: {
    authorization: `Bearer ${API_KEY}`,
  },
})

const fetchData = async (year: number, conference: string) => {
  const { data: teams } = await axios.get('/teams', { params: { conference } })
  const { data: games } = await axios.get('/games', { params: { year, conference } })
  return { teams, games }
}

const saveData = async (year: number, conference: string, data: unknown) => {
  const dest = `./data/${year}-${conference}.json`
  const dir = path.dirname(dest)

  try {
      await fs.mkdir(dir)
  } catch (e) {}

  await fs.writeFile(dest, JSON.stringify(data))
}

const main = async () => {
  const year = new Date().getFullYear()
  const conferences = ['PAC']

  for (const conference of conferences) {
    const data = await fetchData(year, conference)
    await saveData(year, conference, data)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


