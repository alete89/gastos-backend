import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { createConnection, getConnection } from 'typeorm'
import { register, getAllUsers, login } from './authService'
import { isLoggedIn, createAccessToken, createRefreshToken } from './auth'
import cookieParser from 'cookie-parser'
import { verify } from 'jsonwebtoken'
import { User } from '../../model/User'
import { sendRefreshToken } from './sendRefreshToken'

declare module 'express-serve-static-core' {
  interface Request {
    payload?: any
  }
}

;(async () => {
  const app = express()
  app.use(bodyParser.json())

  app.get('/', (_, res) => res.send('hello'))

  app.post('/register', async (req, res) => {
    const { body } = req
    const result = await register(body.email, body.password)
    if (result) {
      return res.status(200).send('ok')
    }
    return res.status(400).send('error: user existed?')
  })

  app.post('/login', async (req, res) => {
    const { body } = req
    const result = await login(body.email, body.password)

    sendRefreshToken(res, result.refreshToken)
    res.status(200).json(result.accessToken)
  })

  app.get('/users', async (_, res) => {
    res.send(await getAllUsers())
  })

  app.get('/validate', isLoggedIn, async (req, res) => {
    console.log(req.payload)
    res.send(req.payload)
  })

  app.post('/refresh_token', cookieParser(), async (req, res) => {
    //isLoggedIn ?
    const token = req.cookies.uid
    if (!token) {
      return res.send({ ok: false, accessToken: '' })
    }
    let payload: any = null
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
    } catch (error) {
      console.log(error)
      return res.send({ ok: false, accessToken: '' })
    }

    // token is valid (was signed with this refresh)
    // and we can send back and access token
    const user = await User.findOne({ id: payload.userId })

    if (!user) {
      return res.send({ ok: false, accessToken: '' })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' })
    }

    sendRefreshToken(res, createRefreshToken(user))

    return res.send({ ok: true, accesToken: createAccessToken(user) })
  })

  app.post('/revoke-refresh', async (req, res) => {
    const userId = req.body.userId

    await getConnection().getRepository(User).increment({ id: userId }, 'tokenVersion', 1)

    res.send(true)
  })

  await createConnection()

  app.listen(4000, () => {
    console.log('started')
  })
})()
