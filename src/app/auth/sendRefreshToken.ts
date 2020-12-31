import { Response } from 'express'

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie('uid', token)
  // res.cookie('uid', token, { httpOnly: true })
}
