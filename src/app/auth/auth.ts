import { sign, verify } from 'jsonwebtoken'
import { Tarjeta } from '../../model/tarjeta'
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

export const hasCard = async ({ payload, body, params }: any, res: any, next: any) => {
  const id_tarjeta = body.id_tarjeta ?? body.tarjeta ?? params.id_tarjeta
  const { userId } = payload

  const tarjetas = await Tarjeta.find({ where: { user: userId } })

  if(tarjetas.length == 0 || !id_tarjeta) {
    res.senStatus(400)
  }

  if (tarjetas.every(tarjeta => tarjeta.id != id_tarjeta)) {
    res.sendStatus(403)
  }

  return next()

}
