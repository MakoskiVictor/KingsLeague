import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import presidents from '../db/presidents.json'
import team from '../db/team.json'
import mvp from '../db/mvp.json'

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
    },
    {
      endpoint: '/mvp',
      descriptions: 'Returns the mvp list'
    }
  ])
})

app.get('/leaderboard\\/?', (c) => {
  return c.json(leaderboard)
})

app.get('/presidents\\/?', (c) => {
  return c.json(presidents)
})

app.get('/presidents/:id', (c) => {
  const id = c.req.param('id')
  const foundPresident = presidents.find(presidents => presidents.id === id)
  return foundPresident
    ? c.json(foundPresident)
    : c.json({ message: 'President not found' }, 404)
})

app.get('/teams\\/?', (c) => {
  return c.json(team)
})

app.get('/teams/:id', (c) => {
  const id = c.req.param('id')
  const foundTeam = team.find(team => team.id === id)
  return foundTeam
    ? c.json(foundTeam)
    : c.json({ message: 'Team not found' }, 404)
})

app.get('/static/*', serveStatic({ root: './' }))

app.get('/mvp\\/?', (c) => {
  return c.json(mvp)
})

export default app
