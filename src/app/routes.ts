import { Request, Response } from 'express'
import { formatearFecha, getAnios, getSelectedTags } from '../lib/helpers'
import { Gasto } from '../model/gasto'
import { Moneda } from '../model/moneda'
import { Summary } from '../model/summary'
import { Tag } from '../model/tag'
import { Tarjeta } from '../model/tarjeta'
import { getAllUsers, getUserFromRequest } from './auth/authService'

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

routes.put('/gastos/mes', async function (req: Request, res: Response) {
  const { anio, mes, id_tarjeta } = req.body
  const fechaABuscar: string = formatearFecha(new Date(anio, mes, 1))
  const gastos = await Gasto.find({
    relations: ['tags', 'moneda', 'tarjeta'],
    where: `fecha_primer_resumen <= '${fechaABuscar}' AND DATE_ADD(fecha_primer_resumen, INTERVAL (cuotas - 1) MONTH) >= '${fechaABuscar}'
        AND tarjetaId = ${id_tarjeta}`,
  })
  res.send(gastos)
})

routes.get('/tags', async function (req: Request, res: Response) {
  const tags = await Tag.find()
  res.send(tags)
})

routes.post('/tags/new', async function (req: Request, res: Response) {
  if (req.body.nombre) {
    const tag = new Tag({ nombre: req.body.nombre })
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

routes.get('/anios/:id_tarjeta', async function (req: Request, res: Response) {
  if (req.params.id_tarjeta) {
    const response = await Tarjeta.query(
      `SELECT MIN(YEAR(fecha_primer_resumen)) as desde,
                    MAX(YEAR(DATE_ADD(fecha_primer_resumen,
                    INTERVAL gasto.cuotas month))) as hasta 
            from gasto
            where tarjetaId = ${req.params.id_tarjeta}`
    )
    const anios = getAnios(Number(response[0].desde), Number(response[0].hasta))
    res.send(anios)
  } else {
    res.sendStatus(400)
  }
})

routes.get('/tarjetas', async function (req: Request, res: Response) {
  // const tarjetas = await Tarjeta.find({ relations: ['gastos'] }) // para qué quería los gastos acá?
  console.log('pide tarjetas')
  const requestingUser = await getUserFromRequest(req.cookies.uid)
  const tarjetas = await Tarjeta.find({ where: { user: requestingUser } })
  res.send(tarjetas)
})

routes.post('/gasto', async function (req: Request, res: Response) {
  try {
    const { body } = req
    const gasto = new Gasto(body)
    gasto.tarjeta = await Tarjeta.findOneOrFail(body.tarjeta)
    gasto.moneda = await Moneda.findOneOrFail(body.moneda)
    gasto.fecha = new Date(body.fecha)
    gasto.tags = await getSelectedTags(body.tags)
    await gasto.save()
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
    console.log(error)
  }
})

routes.post('/tarjeta', async function (req: Request, res: Response) {
  try {
    const { body } = req
    const user = await getUserFromRequest(req.cookies.uid)
    const tarjeta = new Tarjeta({ ...body, user })
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
routes.get('/summary', async function (req: Request, res: Response) {
  const user = await getUserFromRequest(req.cookies.uid)
  const tarjetas = await Tarjeta.find({ relations: ['gastos'], where: { user } })
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
