import { compare, hash } from 'bcryptjs'
import { User } from '../../model/user'
import { createAccessToken, createRefreshToken } from './auth'
import { LoginResponse } from './types'

export const register = async (email: string, password: string): Promise<Boolean> => {
  try {
    const hashedPassword = await hash(password, 12)
    await User.insert({ email, password: hashedPassword })
    return true
  } catch (error) {
    console.log(error)
    return false
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
