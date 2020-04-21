import { Router, Request, Response, NextFunction } from "express";
import { Database as db } from "../global"
import * as jwt from "jsonwebtoken"
import * as dotenv from "dotenv"

dotenv.config()
const router = Router()

const authentication = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) return res.status(401).send({
    message: "No token specified"
  })
  jwt.verify(req.headers.authorization.substr(7), process.env.JWT_SECRET, (verifyErr, decoded) => {
    if (verifyErr) {
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

router.get("/", (req, res) => {
  db.all("SELECT * FROM endpoints", (err, rows) => {
    if (err) return res.status(500).send({
      message: "Internal Error"
    })
    const result = rows.map(row => {
      return {
        name: row.name,
        url: row.url
      }
    })
    res.status(200).send({
      message: "Endpoints",
      data: result
    })
  })
})

router.post("/", authentication, (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "No endpoint was provided"
    })
  }
  db.run("INSERT INTO endpoints (name, url, owner) VALUES ($name, $url, $owner)", {
    $name: req.body.name,
    $url: "http://localhost:8080/api/endpoints/" + encodeURIComponent(req.body.name),
    $owner: res.locals.user.id
  }, (insertErr) => {
    if (insertErr) {
      if (insertErr.message.includes("UNIQUE constraint")) return res.status(409).send({
        message: "Endpoint Exists"
      })
      console.log(insertErr)
      return res.status(500).send({
        message: "Internal Error"
      })
    }
    return res.status(201).send({
      message: "Endpoint Created",
      data: {
        name: req.body.name,
        url: "http://localhost:8080/api/" + encodeURIComponent(req.body.name)
      }
    })
  })
});

router.get("/:endpoint", (req, res) => {
  if (!req.params.endpoint) return res.status(400).send({
    message: "Name required"
  })
  db.get("SELECT name, url, owner FROM endpoints WHERE name=$name", {
    $name: req.params.endpoint
  }, (getErr, getRow) => {
    if (getErr) return res.status(500).send({
      message: "Internal Error"
    })
    return res.status(200).send({
      message: "Endpoint",
      data: {
        name: getRow.name,
        url: getRow.url,
        owner: getRow.owner
      }
    })
  })
})

router.put("/:endpoint", authentication, (req, res) => {

})

// router.post("/:name/permissions", authentication, (req, res) => {
//   if (!req.body.name)
// })

// Weather Data

router.get("/:endpoint/currentData", (req, res) => {
  if (!req.params.endpoint) return res.status(400).send({
    message: "No endpoint was provided"
  })
  db.get("SELECT id FROM endpoints WHERE name=$name", {
    $name: req.params.endpoint
  }, (err, row) => {
    if (err) return res.status(500).send({
      message: "Internal Error"
    })
    if (!row) return res.status(404).send({
      message: "Endpoint Not Found"
    })
    db.get("SELECT date, temperature, humidity FROM endpoint_data WHERE endpoint_id=$endpoint_id ORDER BY date DESC", {
      $endpoint_id: row.id
    }, (dataErr, dataRow) => {
      if (dataErr) return res.status(500).send({
        message: "Internal Error"
      })
      res.status(200).send({
        message: "Current Data",
        data: {
          date: dataRow.date,
          temperature: dataRow.temperature,
          humidity: dataRow.humidity
        }
      })
    })
  })
});

router.get("/:endpoint/data", (req, res) => {
  if (!req.params.endpoint) return res.status(400).send({
    message: "No endpoint was provided"
  })
  db.get("SELECT id FROM endpoints WHERE name=$name", {
    $name: req.params.endpoint
  }, (err, row) => {
    if (err) return res.status(500).send({
      message: "Internal Error"
    })
    if (!row) return res.status(404).send({
      message: "Endpoint Not Found"
    })
    db.all("SELECT date, temperature, humidity FROM endpoint_data WHERE endpoint_id=$endpoint_id ORDER BY date ASC", {
      $endpoint_id: row.id
    }, (dataErr, dataRows) => {
      if (dataErr) return res.status(500).send({
        message: "Internal Error"
      })
      const result = new Array()
      dataRows.forEach(dataRow => {
        result.push({
          date: dataRow.date,
          temperature: dataRow.temperature,
          humidity: dataRow.humidity
        })
      })
      res.status(200).send({
        message: "Data",
        data: result
      })
    })
  })
});

router.post("/:endpoint/data", authentication, (req, res) => {
  if (!req.body.data || !req.params.endpoint) return res.status(400).send({
    message: "A valid endpoint and data array is required"
  })
  db.get("SELECT id FROM endpoints WHERE name=$name", {
    $name: req.params.endpoint
  }, (getErr, getRow) => {
    if (getErr) return res.status(500).send({
      message: "Internal Error"
    })
    if (!getRow) return res.status(404).send({
      message: "Not Found"
    })
    let statement = "INSERT INTO endpoint_data (endpoint_id, date, temperature, humidity) VALUES"
    let params: string[] = []
    for (const element of req.body.data) {
      statement += " (?, ?, ?, ?),"
      params = [...params, getRow.id, element.date, element.temperature, element.humidity]
    }
    db.run(statement.substring(0, statement.length - 1), params, insertErr => {
      if (insertErr) {
        if (insertErr.message.includes("UNIQUE constraint")) return res.sendStatus(400)
        return res.status(500).send({
          message: "Internal Error"
        })
      }
      return res.status(201).send({
        message: "Endpoint Data Created",
        data: req.body.data
      })
    })
  })
})

router.get("/:endpoint/nextData", (req, res) => {
  if (!req.params.endpoint || req.query.minutes && (req.query.minutes < 1 || req.query.minutes > 60)) return res.status(400).send({
    message: "Invalid parameters"
  })
  db.get("SELECT id FROM endpoints WHERE name=$name", {
    $name: req.params.endpoint
  }, (err, row) => {
    if (err) return res.status(500).send({
      message: "Internal Error"
    })
    if (!row) return res.status(404).send({
      message: "Endpoint Not Found"
    })
    db.get("SELECT date, temperature, humidity FROM endpoint_data WHERE endpoint_id=$endpoint_id ORDER BY date DESC", {
      $endpoint_id: row.id
    }, (dataErr, dataRow) => {
      if (dataErr) return res.status(500).send({
        message: "Internal Error"
      })
      const END = req.query.minutes ? req.query.minutes : 60;
      let weather = {
        temperature: dataRow.temperature,
        humidity: dataRow.humidity
      }
      const dateParts = dataRow.date.split("-")
      const currentDate = new Date(
        parseInt(dateParts[0], 10),
        parseInt(dateParts[1], 10),
        parseInt(dateParts[2], 10),
        parseInt(dateParts[3], 10),
        parseInt(dateParts[4], 10)
      );
      const output = [];
      let slopeTemp = Math.floor(Math.random() * 3) - 1 + Math.random() < 0.5 ? -0.1 : 0.1;
      let slopeHum = Math.floor(Math.random() * 3) - 1 + Math.random() < 0.5 ? -0.01 : 0.01;
      for (let i = 0; i < END; i++) {
        currentDate.setMinutes(currentDate.getMinutes() + 1); // Nächstes Datum
        if (i % (Math.floor(Math.random() * 3) + 3) === 0) {
          slopeTemp = Math.floor(Math.random() * 3) - 1 + Math.random() < 0.5 ? -0.1 : 0.1;
          slopeHum = Math.floor(Math.random() * 3) - 1 + Math.random() < 0.5 ? -0.01 : 0.01;
        }
        weather = {
          temperature:
            weather.temperature + (Math.random() / 25) * slopeTemp,
          humidity: weather.humidity + (Math.random() / 2) * slopeHum
        };
        output.push({
          date:
            currentDate.getFullYear() + "-" + (currentDate.getMonth() + "-").padStart(3, '0') + (currentDate.getDate() + "-").padStart(3, '0') + (currentDate.getHours() + "-").padStart(3, '0') + (currentDate.getMinutes() + "").padStart(2, '0'),
          temperature: weather.temperature.toFixed(4),
          humidity: weather.humidity.toFixed(4)
        });
      }
      res.status(200).send({
        message: "Next Data",
        data: output
      });
    })
  })
});

export { router as EndpointRouter }