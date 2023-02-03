import { TEAM, PRESIDENTS } from '../db/index.js'
import { cleanText } from './utils.js'

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

export async function scrapingLiderboard ($) {
  const $rows = $('table tbody tr')

  // Para recuperar los la info de los teams.json / Hacemos un Join de la info => agregamos info adicional al obj del JSON
  const getTeamIdFrom = ({ name }) => {
    const { presidentId, ...restOfTeam } = TEAM.find(team => team.name === name)
    const president = PRESIDENTS.find(president => president.id === presidentId)
    return { ...restOfTeam, president }
  }

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
