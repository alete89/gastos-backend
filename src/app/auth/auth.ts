import { sign, verify } from 'jsonwebtoken'
import { User } from '../../model/user'

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })
}
export const createRefreshToken = (user: User) => {
  return sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '8h',
  })
}

export const isLoggedIn = (req: any, _: any, next: any) => {
  const { authorization } = req.headers

  if (!authorization) {
    throw new Error('not authenticated')
  }
  try {
    const token = authorization.split(' ')[1]
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!)
    req.payload = payload
  } catch (error) {
    console.log(error)
    throw new Error('not authenticated')
  }

  return next()
}
