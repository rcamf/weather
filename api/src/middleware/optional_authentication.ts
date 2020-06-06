import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

dotenv.config()

export const optionalAuthentication = (req: Request, res: Response, next: NextFunction) => {
  let token = ''
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.substr(7)
  }
  jwt.verify(token, process.env.JWT_SECRET, (verifyErr, decoded) => {
    if (req.headers.authorization) {
      if (verifyErr) {
        if (verifyErr.name === 'TokenExpiredError') return res.status(401).send({
          message: 'Token expired'
        })
        return res.status(401).send({
          message: 'Invalid token'
        })
      }
      res.locals.user = decoded
    }
    next()
  })
}