import { Database } from "sqlite3"
import * as dotenv from "dotenv"

dotenv.config()
const db = new Database(process.env.DATABASE, err => {
  if (err) return console.log(err.message)
  console.log('Database started')
})

export { db as Database }