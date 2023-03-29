import 'dotenv/config'
import express from 'express'
import { route as PriavteAPIRoute } from '@/api/v1/private'
import { route as PublicAPIRoute } from '@/api/v1/public'
import { createClient } from 'redis'
export const route = express.Router()

const client = createClient({
  url: 'redis://default:password@localhost:6379',
})

client.on('error', (err) => console.log('Redis Client Error', err))

// route.use("/", PublicAPIRoute);
// route.use("/", PriavteAPIRoute);

const connect = async () => {
  try {
    await client.connect()
  } catch (error) {}
}

route.get('/connect', async (req, res) => {
  await connect()

  await client.set('key', 'value123')
  const value = await client.get('key')
  res.send(value)
})

route.get('/signup', async (req, res) => {
  const { username, password } = req.body as {
    username: string
    password: string
  }

  await connect()

  const pass = await client.get(username)

  if (pass) {
    res.statusCode = 400

    res.json({
      message: 'already present',
      success: false,
    })

    return
  }

  client.set(username, password)
  res.statusCode = 200

  res.send({
    message: `Created Username: ${username} & Password : ${password}`,
    success: true,
  })
})

route.get('/login', async (req, res) => {
  await connect()

  const { username, password } = req.body as {
    username: string
    password: string
  }

  if ((await client.get(username)) !== password) {
    res.statusCode = 400
  } else {
    res.statusCode = 200
  }

  res.json({
    success: res.statusCode === 200,
  })
})
