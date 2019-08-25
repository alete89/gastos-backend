import express, { Request, Response } from "express"
import { createConnection } from "typeorm"
import { Moneda } from "../model/moneda"
import { Bootstrap } from "./bootstrap"
import { Gasto } from "../model/gasto"

// Create a new express application instance
const app: express.Application = express()
const bootstrap: Bootstrap = new Bootstrap()

app.get("/", function(req, res) {
    res.send("Welcome TEST")
})

app.get("/monedas", async function(req: Request, res: Response) {
    const monedas = await Moneda.find()
    res.send(monedas)
})

app.get("/gastos", async function(req: Request, res: Response) {
    const gastos = await Gasto.find()
    res.send(gastos)
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
