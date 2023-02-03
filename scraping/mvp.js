
import { writeDBFile, TEAM } from '../db/index.js'
import { scrape, URLS, cleanText } from './utils.js'

async function getMvpList () {
  const $ = await scrape(URLS.mvp)
  const $rows = $('table tbody tr')

  const MVP_SELECTORS = {
    rank: { selector: '.fs-table-text_1', typeof: 'number' },
    team: { selector: '.fs-table-text_3', typeof: 'string' },
    playerName: { selector: '.fs-table-text_4', typeof: 'string' },
    gamesPlayed: { selector: '.fs-table-text_5', typeof: 'number' },
    mvps: { selector: '.fs-table-text_6', typeof: 'number' }
  }

  const getImageFromTeam = ({ name }) => {
    const { image } = TEAM.find(
      (team) => team.name === name
    )
    return image
  }
}
