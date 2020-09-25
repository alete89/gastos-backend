import express from 'express'
import { createConnection } from 'typeorm'
import { Bootstrap } from './bootstrap'
import { routes } from './routes'

// Create a new express application instance
const app: express.Application = express()
const bootstrap: Bootstrap = new Bootstrap()

app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // allow requests from any other server
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE') // allow these verbs
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control')
  next()
})

app.use(routes)

app.listen(9000, function () {
  console.log('Gastos backend listening on port 9000!')
})

async function run() {
  await createConnection()
}

async function runBootstrap() {
  await bootstrap.run()
}

run().then(() => runBootstrap())
