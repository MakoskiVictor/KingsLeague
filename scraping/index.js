import * as cheerio from 'cheerio'
import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
// Cuando usamos ESModules no podemos importar json directamente: import TEAM from '../db/team.json'
// hay que usar el import assert type:
// import TEAM from '../db/team.json' assert { tyoe: 'json' } => en este caso el inter no lo soporta, así que necesesitamos:
const DB_PATH = path.join(process.cwd(), './db/')
// Esto es un TOP LEVEL AWAIT
const TEAM = await readFile(`${DB_PATH}/team.json`, 'utf-8').then(JSON.parse)
// JSON.parse() => convierte lo que traemos a json

const URLS = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function scrapingLiderboard () {
  const $ = await scrape(URLS.leaderboard)
  const $rows = $('table tbody tr')

  // Selectores
  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    goalsScored: { selector: '.fs-table-text_6', typeOf: 'number' },
    goalsConceded: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
  }
  // Para recuperar los la info de los teams.json
  const getTeamIdFrom = ({ name }) => TEAM.find(team => team.name === name)

  // Limpieza de datos
  const cleanText = text => text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  const leaderboard = []
  $rows.each((index, el) => {
    const leaderBoardEntries = leaderBoardSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rawValue = $(el).find(selector).text()
      const cleanedValue = cleanText(rawValue)

      const value = typeOf === 'number'
        ? Number(cleanedValue)
        : cleanedValue

      return [key, value]
    })

    const { team: teamName, ...leaderboardForTeam } = Object.fromEntries(leaderBoardEntries)
    const team = getTeamIdFrom({ name: teamName })
    leaderboard.push({
      ...leaderboardForTeam,
      team
    })
  })
  return leaderboard
}

const leaderboard = await scrapingLiderboard()
// Creo una ruta relativa de fichero
// cwd => current working directory
// const filePath = path.join(process.cwd(), './db/leaderboard.json') => ya no lo necesitamos
await writeFile(`${DB_PATH}/leaderboard.json`, JSON.stringify(leaderboard, null, 2), 'utf-8')
