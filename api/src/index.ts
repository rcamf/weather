import cors from "cors";
import express from "express";
import { EndpointRouter } from "./routers/EndpointRouter"
import { AuthRouter } from "./routers/AuthRouter";
import * as dotenv from "dotenv"
import { UserRouter } from "./routers/UserRouter";

// Admin pw: PasswortIstSicher

dotenv.config()
const PORT = process.env.PORT || 8080;

const whitelist = ['http://localhost:4200', 'http://192.168.178.26:4200']
const corsOptions = {
  origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
    if (whitelist.indexOf(origin) !== -1) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  }
}

const app = express()
app.disable('X-powered-by')

app.use(express.json())

app.use('/endpoints', cors(), EndpointRouter)
app.use('/auth', cors(), AuthRouter)
app.use('/users', cors(), UserRouter)

// start the Express server
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
