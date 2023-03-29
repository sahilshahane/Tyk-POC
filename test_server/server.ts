import 'dotenv/config'
import express from 'express'
import { route as APIv1Route } from '@/api/v1'
import { APIErrorHandler } from '@/middleware/APIErrorHandler'
import { dbConnect } from '@/database/connect'
import { morganMiddleware } from '@/middleware/morganHandler'
import { logger } from '@/libs/logger'
import cors from 'cors'

import { createClient } from 'redis'

logger.info(`NODE_ENV = ${process.env.NODE_ENV}`)

const PORT = process.env.PORT

if (!PORT) throw new Error('Please add PORT in your .env config')

const app = express()

app.use(cors())
app.use(morganMiddleware)

app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(express.json())
app.use('/api/v1', APIv1Route)

app.use(APIErrorHandler)

app.get('/', (req, res) => {
  res.send('Server is running, send requests to /api/v1/ path')
})

// dbConnect()
//   .then(() => logger.info('Connected to MongoDB'))
//   .then(() =>
//     app.listen(PORT, () => {
//       logger.info(`Server Started at http://localhost:${PORT}`)
//     })
//   )
//   .catch((err) => logger.error('Something went wrong :', err))

const oauthRouter = express.Router()

oauthRouter.get('/authorize', (req, res) => {})

app.use('/oauth', oauthRouter)

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
  console.log('called')
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
    reqHeaders: req.headers,
  })
})

app.use('/', route)

app.listen(PORT, () => {
  logger.info(`Server Started at http://localhost:${PORT}`)
})
