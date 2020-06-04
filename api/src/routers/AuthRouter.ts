import * as pw from "argon2"
import * as dotenv from "dotenv"
import { Router } from "express"
import * as jwt from "jsonwebtoken"
import { Database as db } from "../global"
import { resolveSoa } from "dns"

dotenv.config()
const router = Router()

router.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) return res.status(400).send({
    message: "A valid username and password is required"
  })
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  try {
    const user = userStmt.get({ username: req.body.username })
    if (!user || !await pw.verify(user.password, req.body.password, { type: pw.argon2id })) return res.status(404).send({
      message: "Invalid Credentials"
    })
    const token = jwt.sign({
      id: user.id
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
    return res.status(200).send({
      message: "Login Successful",
      data: {
        token,
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        public: user.public === 1,
        followers: user.followers,
        following: user.following
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.post('/signup', async (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) return res.status(400).send({
    message: "A valid email, password and username is required"
  })
  const signupStmt = db.prepare('INSERT INTO users (username, name, surname, email, public, password) VALUES ($username, $name, $surname, $email, $public, $password)')
  const userStmt = db.prepare('SELECT * FROM users WHERE username=$username')
  try {

    const insertion = signupStmt.run({
      username: req.body.username,
      name: req.body.name || '',
      surname: req.body.surname || '',
      email: req.body.email,
      public: 1,
      password: await pw.hash(req.body.password, { type: pw.argon2id })
    })
    const user = userStmt.get({ username: req.body.username })
    const token = jwt.sign({
      id: user.id
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
    return res.status(200).send({
      message: 'Signup Successful',
      data: {
        token,
        username: user.username,
        name: user.name,
        surname: user.surname,
        email: user.email,
        public: user.public === 1,
        followers: user.followers,
        following: user.following
      }
    })
  } catch (error) {
    console.log(error.code)
    if (error.code.includes('UNIQUE')) return res.status(400).send({
      message: 'Username unavailable'
    })
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

export { router as AuthRouter }

