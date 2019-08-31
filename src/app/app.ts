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

app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded()) // to support URL-encoded bodies

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // allow requests from any other server
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE") // allow these verbs
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control")
    next()
})

app.get("/", function(req, res) {
    res.send("Welcome TEST")
})

app.get("/monedas", async function(req: Request, res: Response) {
    const monedas = await Moneda.find()
    res.send(monedas)
})

app.get("/gastos", async function(req: Request, res: Response) {
    const gastos = await Gasto.find({ relations: ["tags", "moneda", "tarjeta"] })
    res.send(gastos)
})

app.get("/tags", async function(req: Request, res: Response) {
    const tags = await Tag.find()
    res.send(tags)
})

app.get("/tarjetas", async function(req: Request, res: Response) {
    const tarjetas = await Tarjeta.find({ relations: ["gastos"] })
    res.send(tarjetas)
})

app.post("/gasto", async function(req: Request, res: Response) {
    try {
        console.log(req.body)
        const gasto = new Gasto(req.body)
        await gasto.save()
        res.send(ok)
    } catch (error) {
        res.sendStatus(400)
    }
})

app.listen(3000, function() {
    console.log("Example app listening on port 3000!")
})

async function run() {
    await createConnection()
}

async function runBootstrap() {
    await bootstrap.run()
}

run().then(() => runBootstrap())
