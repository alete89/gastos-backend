import cors from 'cors'
import express from 'express'
import 'dotenv/config'
import { createConnection } from 'typeorm'
import authRoutes from './auth/routes'
import { Bootstrap } from './bootstrap'
import { routes } from './routes'

// Create a new express application instance
const app: express.Application = express()
const bootstrap: Bootstrap = new Bootstrap()

app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

app.use(routes)
app.use(authRoutes)

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
