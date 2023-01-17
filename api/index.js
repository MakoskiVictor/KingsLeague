import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import presidents from '../db/presidents.json'
import team from '../db/Team.json'

const app = new Hono()

app.get('/', (c) => {
  return c.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the leaderboard'
    },
    {
      endpoint: '/presidents',
      descriptions: 'Returns the presidents info'
    },
    {
      endpoint: '/teams',
      descriptions: 'Returns the teams info'
    }
  ])
})

app.get('/leaderboard', (c) => {
  return c.json(leaderboard)
})

app.get('/presidents', (c) => {
  return c.json(presidents)
})

app.get('/teams', (c) => {
  return c.json(team)
})

app.get('/static/*', serveStatic({ root: './' }))

export default app
