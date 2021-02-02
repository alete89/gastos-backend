import 'dotenv/config'
import { Router } from 'express'
import 'reflect-metadata'
import { getConnection } from 'typeorm'
import { User } from '../../model/user'
import { createAccessToken, createRefreshToken, isLoggedIn, validateRefreshToken } from './auth'
import { login, register } from './authService'
import { sendRefreshToken } from './sendRefreshToken'

declare module 'express-serve-static-core' {
  interface Request {
    payload?: any
  }
}

const routes = Router()

routes.post('/register', async ({ body: { email, password } }, res) => {
  const result = await register(email, password)
  if (result.ok) {
    return res.status(200).json('ok')
  }
  return res.status(400).json(result.message)
})

routes.post('/login', async ({ body: { email, password } }, res) => {
  try {
    const { accessToken, refreshToken } = await login(email, password)

    sendRefreshToken(res, refreshToken)
    res.status(200).json(accessToken)
  } catch (error) {
    res.status(401).json(error)
  }
})

routes.get('/validate', isLoggedIn, async ({ payload }, res) => {
  console.log(payload)
  res.send(payload)
})

routes.post('/refresh_token', validateRefreshToken, async ({ payload: user }, res) => {

  sendRefreshToken(res, createRefreshToken(user))

  return res.send({ ok: true, accessToken: createAccessToken(user) })
})

routes.post('/revoke-refresh', async ({ body: { userId } }, res) => {
  await getConnection().getRepository(User).increment({ id: userId }, 'tokenVersion', 1)

  res.send(true)
})

routes.post('/logout', async (req, res) => {
  sendRefreshToken(res, '')

  res.send(true)
})

export default routes
