import { Request, Response } from 'express'
import { getConnection } from 'typeorm'
import { meses } from '../lib/constants'
import { getAnios, getSelectedTags, toDate } from '../lib/helpers'
import { Gasto } from '../model/gasto'
import { Moneda } from '../model/moneda'
import { Summary } from '../model/summary'
import { Tag } from '../model/tag'
import { Tarjeta } from '../model/tarjeta'
import { gastosDeUnAnio, gastosDeUnMesYAnio } from '../repos/repoGasto'
import { isLoggedIn, hasCard } from './auth/auth'
import { getAllUsers } from './auth/authService'

export const routes = require('express').Router()

routes.get('/', function (req: Request, res: Response) {
  res.send('Welcome TEST')
})

routes.get('/monedas', async function (req: Request, res: Response) {
  const monedas = await Moneda.find()
  res.send(monedas)
})

routes.get('/gastos', async function (req: Request, res: Response) {
  const gastos = await Gasto.find({ relations: ['tags', 'moneda', 'tarjeta'] })
  res.send(gastos)
})

routes.put('/gastos/mes', isLoggedIn, hasCard, async function ({ body }: Request, res: Response) {
  const { anio, mes, id_tarjeta } = body

  const gastos = await gastosDeUnMesYAnio(id_tarjeta, mes, anio, ['tags', 'moneda', 'tarjeta'])
  res.send(gastos)
})

routes.get('/tags', isLoggedIn, async function (req: Request, res: Response) {
  const tags = await Tag.find()
  res.send(tags)
})

routes.post('/tags/new', isLoggedIn, async function ({ body: { nombre } }: Request, res: Response) {
  if (nombre) {
    const tag = new Tag({ nombre })
    try {
      await Tag.insert(tag)
      res.sendStatus(200)
    } catch {
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
})

routes.get('/anios/:id_tarjeta', isLoggedIn, hasCard, async function ({ params: { id_tarjeta } }: Request, res: Response) {
  const response = await getConnection().query(
    `SELECT MIN(EXTRACT(YEAR FROM fecha_primer_resumen)) as desde,
                    MAX(EXTRACT(YEAR FROM (fecha_primer_resumen + INTERVAL '1 month' * (cuotas - 1) ))) as hasta 
            from gasto
            where "tarjetaId" = $1`, [id_tarjeta]
  )
  const anios = getAnios(Number(response[0].desde), Number(response[0].hasta))
  res.send(anios)
})

routes.get(
  '/meses/:anio/tarjeta/:id_tarjeta',
  isLoggedIn,
  hasCard,
  async function ({ params: { id_tarjeta, anio } }: Request, res: Response) {
    if (id_tarjeta && anio) {
      const gastos = await gastosDeUnAnio(id_tarjeta, Number(anio))

      const mesesGastos = meses.map((mes, index) => ({
        descripcion: mes,
        tieneGastos: gastos.some((gasto) => gasto.estaEnResumen(Number(anio), index)),
      }))

      res.send(mesesGastos)
    } else {
      res.sendStatus(400)
    }
  }
)

routes.get('/tarjetas', isLoggedIn, async function (req: Request, res: Response) {
  const userId = req.payload.userId
  // const tarjetas = await Tarjeta.find({ relations: ['gastos'] }) // para qué quería los gastos acá?
  console.log('pide tarjetas')
  const tarjetas = await Tarjeta.find({ where: { user: userId } })
  res.send(tarjetas)
})

routes.post('/gasto', isLoggedIn, hasCard, async function ({ body }: Request, res: Response) {
  try {
    const { fecha, tarjeta, moneda, tags } = body
    body.fecha = toDate(fecha)
    body.tarjeta = await Tarjeta.findOneOrFail(tarjeta)
    body.moneda = await Moneda.findOneOrFail(moneda)
    body.tags = await getSelectedTags(tags)
    const gasto = new Gasto(body)
    await gasto.save()
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
    console.log(error)
  }
})

routes.post('/tarjeta', isLoggedIn, async function ({ body, payload }: Request, res: Response) {
  try {
    const tarjeta = new Tarjeta({ ...body, user: payload.userId })
    await tarjeta.save()
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
    console.log(error)
  }
})

/**
 * Returns an array with three elements (last month, this month, next month)
 * each one is an array with the sum of all the gastos of the month for each Credit card in the system
 */
routes.get('/summary', isLoggedIn, async function ({ payload: { userId} }: Request, res: Response) {
  const tarjetas = await Tarjeta.find({ relations: ['gastos'], where: { user: userId } })
  const hoy = new Date()
  const meses = [
    new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate()),
    hoy,
    new Date(hoy.getFullYear(), hoy.getMonth() + 1, hoy.getDate()),
  ]
  const result = tarjetas.map(
    (tarjeta) =>
      new Summary(
        tarjeta.nombre,
        meses.map((mes) => tarjeta.totalMes(mes.getFullYear(), mes.getMonth()))
      )
  )

  const response = {
    tarjetas: result,
    subtotales: meses.map((mes, index) => result.reduce((acum, tarjeta) => acum + tarjeta.totales[index], 0)),
  }

  res.send(response)
})

/**
 * USER
 */
routes.get('/users', async (_: Request, res: Response) => {
  res.send(await getAllUsers())
})
