import express, { Request, Response } from "express"
import { createConnection } from "typeorm"
import { Gasto } from "../model/gasto"
import { Moneda } from "../model/moneda"
import { Bootstrap } from "./bootstrap"
import { Tag } from "../model/tag"
import { Tarjeta } from "../model/tarjeta"
import { ok } from "assert"

// Create a new express application instance
const app: express.Application = express()
const bootstrap: Bootstrap = new Bootstrap()
let moment = require('moment');

app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded()) // to support URL-encoded bodies

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // allow requests from any other server
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE") // allow these verbs
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control")
    next()
})

app.get("/", function (req, res) {
    res.send("Welcome TEST")
})

app.get("/monedas", async function (req: Request, res: Response) {
    const monedas = await Moneda.find()
    res.send(monedas)
})

app.get("/gastos", async function (req: Request, res: Response) {
    const gastos = await Gasto.find({ relations: ["tags", "moneda", "tarjeta"] })
    res.send(gastos)
})

app.put("/gastos/mes", async function (req: Request, res: Response) {
    let fecha = new Date(req.body.anio, req.body.mes, 1)
    let fechaFormateada: Date = moment(fecha).format('YYYY-MM-DD HH:mm:SS')
    let unMesAntes = moment(fecha.setMonth(fecha.getMonth() - 1)).format('YYYY-MM-DD HH:mm:SS')
    const gastos = await Gasto.find({
        relations: ["tags", "moneda", "tarjeta"],
        where:
            `(DATE_ADD(gasto.fecha, INTERVAL (gasto.cuotas) MONTH) >= '${fechaFormateada}'
        AND fecha_cierre_resumen < '${fechaFormateada}'
        AND gasto.fecha <= gasto.fecha_cierre_resumen) 
        OR (DATE_ADD(gasto.fecha, INTERVAL (gasto.cuotas + 1) MONTH) >= '${fechaFormateada}' 
        AND fecha_cierre_resumen < '${unMesAntes}' 
        AND gasto.fecha > gasto.fecha_cierre_resumen)`
    })
    res.send(gastos)
})

app.get("/tags", async function (req: Request, res: Response) {
    const tags = await Tag.find()
    res.send(tags)
})

app.get("/tarjetas", async function (req: Request, res: Response) {
    const tarjetas = await Tarjeta.find({ relations: ["gastos"] })
    res.send(tarjetas)
})

app.post("/gasto", async function (req: Request, res: Response) {
    try {
        const gasto = new Gasto(req.body)
        gasto.tarjeta = await Tarjeta.findOneOrFail(req.body.tarjeta)
        gasto.moneda = await Moneda.findOneOrFail(req.body.moneda)
        gasto.fecha = new Date(req.body.anio, req.body.mes, req.body.dia)
        gasto.setFechaCierreResumen()
        await gasto.save()
        res.send(ok)
    } catch (error) {
        res.sendStatus(400)
        console.log(error)
    }
})

app.listen(3000, function () {
    console.log("Example app listening on port 3000!")
})

async function run() {
    await createConnection()
}

async function runBootstrap() {
    await bootstrap.run()
}

run()
    // .then(() => runBootstrap())

