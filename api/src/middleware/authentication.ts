import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { type } from "os";

dotenv.config()

export const authentication = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) return res.status(401).send({
    message: "No token specified"
  })
  jwt.verify(req.headers.authorization.substr(7), process.env.JWT_SECRET, (verifyErr, decoded) => {
    if (verifyErr) {
      console.log(verifyErr)
      if (verifyErr.name === "TokenExpiredError") return res.status(401).send({
        message: "Token expired"
      })
      return res.status(401).send({
        message: "Invalid token"
      })
    }
    res.locals.user = decoded
    next()
  })
}