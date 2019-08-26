import express, { Request, Response } from "express"
import { createConnection } from "typeorm"
import { Gasto } from "../model/gasto"
import { Moneda } from "../model/moneda"
import { Bootstrap } from "./bootstrap"
import { Tag } from "../model/tag"
import { Tarjeta } from "../model/tarjeta"

// Create a new express application instance
const app: express.Application = express()
const bootstrap: Bootstrap = new Bootstrap()

app.use(express.json()) // to support JSON-encoded bodies
// app.use(express.urlencoded()); // to support URL-encoded bodies

app.get("/", function(req, res) {
    res.send("Welcome TEST")
})

app.get("/monedas", async function(req: Request, res: Response) {
    const monedas = await Moneda.find()
    res.send(monedas)
})

app.get("/gastos", async function(req: Request, res: Response) {
    const gastos = await Gasto.find({ relations: ["tags"] })
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
