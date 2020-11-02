import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { Router } from 'express'
import { verify } from 'jsonwebtoken'
import 'reflect-metadata'
import { getConnection } from 'typeorm'
import { User } from '../../model/user'
import { createAccessToken, createRefreshToken, isLoggedIn } from './auth'
import { login, register } from './authService'
import { sendRefreshToken } from './sendRefreshToken'

declare module 'express-serve-static-core' {
  interface Request {
    payload?: any
  }
}

const routes = Router()

routes.post('/register', async (req, res) => {
  const { body } = req
  const result = await register(body.email, body.password)
  if (result) {
    return res.status(200).send('ok')
  }
  return res.status(400).send('error: user existed?')
})

routes.post('/login', async (req, res) => {
  const { body } = req
  try {
    const result = await login(body.email, body.password)

    sendRefreshToken(res, result.refreshToken)
    res.status(200).json(result.accessToken)
  } catch (error) {
    res.status(401).json(error)
  }
})

routes.get('/validate', isLoggedIn, async (req, res) => {
  console.log(req.payload)
  res.send(req.payload)
})

routes.post('/refresh_token', cookieParser(), async (req, res) => {
  //isLoggedIn ?
  console.log('refresh invoked')
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

  return res.send({ ok: true, accessToken: createAccessToken(user) })
})

routes.post('/revoke-refresh', async (req, res) => {
  const userId = req.body.userId

  await getConnection().getRepository(User).increment({ id: userId }, 'tokenVersion', 1)

  res.send(true)
})

export default routes
