import { ok } from 'assert'
import express, { Request, Response } from 'express'
import { createConnection } from 'typeorm'
import { Gasto } from '../model/gasto'
import { Moneda } from '../model/moneda'
import { Tag } from '../model/tag'
import { Tarjeta } from '../model/tarjeta'
import { Bootstrap } from './bootstrap'

// Create a new express application instance
const app: express.Application = express()
const bootstrap: Bootstrap = new Bootstrap()

app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') // allow requests from any other server
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE') // allow these verbs
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control')
    next()
})

app.get('/', function(req, res) {
    res.send('Welcome TEST')
})

app.get('/monedas', async function(req: Request, res: Response) {
    const monedas = await Moneda.find()
    res.send(monedas)
})

app.get('/gastos', async function(req: Request, res: Response) {
    const gastos = await Gasto.find({ relations: ['tags', 'moneda', 'tarjeta'] })
    res.send(gastos)
})

app.put('/gastos/mes', async function(req: Request, res: Response) {
    const fechaABuscar: string = formatearFecha(new Date(req.body.anio, req.body.mes, 1))
    const gastos = await Gasto.find({
        relations: ['tags', 'moneda', 'tarjeta'],
        where: `fecha_primer_resumen <= '${fechaABuscar}' AND DATE_ADD(fecha_primer_resumen, INTERVAL (cuotas - 1) MONTH) >= '${fechaABuscar}'
        AND tarjetaId = ${req.body.id_tarjeta}`,
    })
    res.send(gastos)
})

app.get('/tags', async function(req: Request, res: Response) {
    const tags = await Tag.find()
    res.send(tags)
})

app.put('/anios', async function(req: Request, res: Response) {
    const response = await Tarjeta.query(
        `SELECT MIN(YEAR(fecha_primer_resumen)) as desde,
                MAX(YEAR(DATE_ADD(fecha_primer_resumen,
                INTERVAL gasto.cuotas month))) as hasta 
        from gasto
        where tarjetaId = ${req.body.id_tarjeta}`
    )
    const anios = getAnios(Number(response[0].desde), Number(response[0].hasta))
    res.send(anios)
})

app.get('/tarjetas', async function(req: Request, res: Response) {
    const tarjetas = await Tarjeta.find({ relations: ['gastos'] })
    res.send(tarjetas)
})

app.post('/gasto', async function(req: Request, res: Response) {
    try {
        const gasto = new Gasto(req.body)
        gasto.tarjeta = await Tarjeta.findOneOrFail(req.body.tarjeta)
        gasto.moneda = await Moneda.findOneOrFail(req.body.moneda)
        gasto.fecha = new Date(req.body.anio, req.body.mes, req.body.dia)
        gasto.calcularFechaPrimerResumen()
        gasto.tags = await getSelectedTags(req.body.tags)
        await gasto.save()
        res.send(ok)
    } catch (error) {
        res.sendStatus(400)
        console.log(error)
    }
})

app.listen(3000, function() {
    console.log('Gastos backend listening on port 3000!')
})

async function run() {
    await createConnection()
}

async function runBootstrap() {
    await bootstrap.run()
}

function formatearFecha(fecha: Date) {
    return `${fecha.toISOString().slice(0, 10)} 00:00:00`
}

function getAnios(desde: number, hasta: number) {
    const anios: Array<number> = []
    for (desde; desde <= hasta; desde++) {
        anios.push(desde)
    }
    return anios
}

async function getSelectedTags(ids: Array<number>) {
    const allTags = await Tag.find()
    const selectedTags: Array<Tag> = []
    ids.forEach(currentId => {
        const foundTag = allTags.find(tag => tag.id == currentId)
        if (foundTag) {
            selectedTags.push(foundTag)
        }
    })
    return selectedTags
}

run()
// .then(() => runBootstrap())
