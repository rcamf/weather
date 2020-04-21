import cors from "cors";
import express from "express";
import { EndpointRouter } from "./routers/EndpointRouter"
import { UserRouter } from "./routers/UsersRouter";
import * as dotenv from "dotenv"

// Admin pw: PasswortIstSicher

dotenv.config()
const PORT = process.env.PORT || 8080;

const app = express()
app.disable('X-powered-by')

app.use(cors());
app.use(express.json())

app.use('/endpoints', EndpointRouter)
app.use('/auth', UserRouter)

// start the Express server
app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});
