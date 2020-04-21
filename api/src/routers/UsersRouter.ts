import { Router } from "express"
import * as pw from "argon2"
import { Database as db } from "../global"
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"

dotenv.config()
const router = Router()

router.post('/signin', (req, res) => {
  if (!req.body.username || !req.body.password) return res.status(400).send({
    message: "A valid username and password is required"
  })
  db.get("SELECT id, username, email, password FROM users WHERE username=$username", {
    $username: req.body.username
  }, async (getErr, getRow) => {
    if (getErr) return res.status(500).send({
      message: "Internal Error"
    })
    if (!getRow) return res.status(404).send({
      message: "Invalid User"
    })
    const pwCheck = await pw.verify(getRow.password, req.body.password, { type: pw.argon2id })
    if (!pwCheck) return res.status(401).send({
      message: "Login Failed"
    })
    const token = jwt.sign({
      id: getRow.id,
      username: getRow.username
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
    return res.status(200).send({
      message: "Login Successful",
      data: {
        token,
        username: getRow.username,
        email: getRow.email
      }
    })

  })
})

router.post('/signup', (req, res) => {
  if (!req.body.email || !req.body.username || !req.body.password) return res.status(400).send({
    message: "A valid email, password and username is required"
  })
  db.get("SELECT id FROM users WHERE username=$username", {
    $username: req.body.username
  }, async (getErr, row) => {
    if (getErr) return res.status(500).send({
      message: "Internal Error"
    })
    if (row) return res.status(409).send({
      message: "User Exists"
    })
    const pwHash = await pw.hash(req.body.password, { type: pw.argon2id })
    db.get("INSERT INTO users (username, email, password) VALUES ($username, $email, $password); SELECT last_insert_rowid()", {
      $username: req.body.username,
      $email: req.body.email,
      $password: pwHash
    }, (insertErr, getRow) => {
      if (insertErr) return res.status(500).send({
        message: "Internal Error"
      })
    const token = jwt.sign({
      id: getRow.id,
      username: getRow.username
    }, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
      res.status(201).send({
        message: "User Created",
        data: {
          token,
          username: req.body.username,
          email: req.body.email
        }
      })
    })
  })
})

export { router as UserRouter }

