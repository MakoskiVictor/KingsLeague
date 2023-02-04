import * as cheerio from 'cheerio'
import { writeDBFile } from '../db/index.js'
import { getCoaches } from './coaches.js'
import { scrapingLiderboard } from './leaderboard.js'
import { logError, logInfo, logSuccess } from './log.js'
import { getMvpList } from './mvp.js'

export async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

export const SCRAPINGS = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: scrapingLiderboard
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvpList
  },
  coaches: {
    url: 'https://es.besoccer.com/competicion/info/kings-league/2023',
    scraper: getCoaches
  }
}

// Limpieza de datos
export const cleanText = text => text
  .replace(/\t|\n|\s:/g, '')
  .replace(/.*:/g, ' ')
  .trim()

export async function scrapeAndSave (name) {
  const start = performance.now()
  try {
    const { scraper, url } = SCRAPINGS[name]
    const $ = await scrape(url)

    logInfo(`Scraping ${name}...`)
    logSuccess(`${name} scaped successfully`)
    const content = await scraper($)
    logInfo(`Writting ${name} into DataBAse...`)
    await writeDBFile(name, content)
    logSuccess(`${name} written successfully`)
  } catch (e) {
    logError(e)
  } finally {
    const end = performance.now()
    const time = (end - start) / 1000
    logInfo(`[${name}] scraped in ${time} seconds`)
  }
}
