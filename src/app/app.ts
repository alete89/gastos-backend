import cors from 'cors'
import express from 'express'
import 'dotenv/config'
import { createConnection } from 'typeorm'
import authRoutes from './auth/routes'
import { Bootstrap } from './bootstrap'
import { routes } from './routes'
import cookieParser from 'cookie-parser'

// Create a new express application instance
const app: express.Application = express()
const bootstrap: Bootstrap = new Bootstrap()
const port = process.env.PORT || 9000

app.use(cookieParser()) // access to cookies
app.use(express.json()) // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })) // to support URL-encoded bodies
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }))

app.use(routes)
app.use(authRoutes)

app.listen(port, function () {
  console.log('Gastos backend listening on port 9000!')
})

async function run() {
  const connection = await createConnection()
  await connection.synchronize(true)
}

async function runBootstrap() {
  await bootstrap.run()
}

run().then(() => runBootstrap())
