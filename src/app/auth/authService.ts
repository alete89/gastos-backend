import { compare, hash } from 'bcryptjs'
import { User } from '../../model/user'
import { createAccessToken, createRefreshToken } from './auth'
import { LoginResponse } from './types'
import { verify } from 'jsonwebtoken'

export const register = async (email: string, password: string): Promise<any> => {
  try {
    const hashedPassword = await hash(password, 12)
    await User.insert({ email, password: hashedPassword })
    return { ok: true }
  } catch (error) {
    let message = ''
    console.log(error)
    if (error.errno) {
      message = 'user exists' // TODO: do I want to return this information?
    }
    return { ok: false, message }
  }
}
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const user = await User.findOne({ select: ['id', 'email', 'password', 'tokenVersion'], where: { email } })
    if (!user) {
      throw new Error('user not found')
    }
    const valid = await compare(password, user.password)
    console.log(`valid: ${valid}`)
    if (!valid) {
      throw new Error('bad password')
    }
    // login successful
    return {
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
    }
  } catch (error) {
    console.log(error)
    // return { accessToken: '', refreshToken: '' }
    throw error
  }
}

export const getAllUsers = async (): Promise<User[]> => {
  try {
    return User.find()
  } catch (error) {
    console.log(error)
    return []
  }
}

export const getUserFromRequest = async (token: string): Promise<User> => {
  if (!token) {
    throw 'unauthorized?'
  }
  let payload: any = null
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
  } catch (error) {
    console.log(error)
    throw 'unauthorized?'
  }

  const user = await User.findOne({ select: ['id', 'email'], where: { id: payload.userId } })

  if (!user) {
    throw 'user does not exist?'
  }

  return user
}
