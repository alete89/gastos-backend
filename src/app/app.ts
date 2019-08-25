import express, { Request, Response } from "express"
import { createConnection } from "typeorm"
import { Moneda } from "../model/moneda"

// Create a new express application instance
const app: express.Application = express()

app.get("/", function(req, res) {
    res.send("Welcome TEST")
})

app.get("/monedas", async function(req: Request, res: Response) {
    const monedas = await Moneda.find()
    res.send(monedas)
})

app.listen(3000, function() {
    console.log("Example app listening on port 3000!")
})

async function run() {
    await createConnection()
}

function createTest() {
    const moneda = new Moneda()
    moneda.nombre = "pesito"
    moneda.save()
}

run().then(() => createTest())
