import * as dotenv from "dotenv"
import Database from "better-sqlite3"

dotenv.config()

const db = new Database(process.env.DATABASE)
console.log(db.pragma('foreign_keys=ON'))
console.log(db.pragma('journal_mode=WAL'))

export { db as Database }
