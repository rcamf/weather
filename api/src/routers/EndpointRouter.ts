import * as dotenv from "dotenv";
import { Router } from "express";
import { Database as db } from "../global";
import { authentication } from "../middleware/authentication";
import { v4 as uuid } from 'uuid';

dotenv.config()
const router = Router()

router.get("/", (req, res) => {
  const endpointsStmt = db.prepare('SELECT * FROM endpoints')
  try {
    const endpoints = endpointsStmt.all()
    return res.status(200).send({
      message: 'Endpoints',
      data: endpoints.map(endpoint => {
        return {
          id: endpoint.id,
          city: endpoint.city,
          country: endpoint.country,
          owner_id: endpoint.owner_id,
          lat: endpoint.lat,
          long: endpoint.long
        }
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.post("/", authentication, (req, res) => {
  if (!req.body.city || !req.body.country || !req.body.lat || !req.body.long) {
    return res.status(400).send({
      message: "City, country, latitude and longitude are required"
    })
  }
  const insertStmt = db.prepare('INSERT INTO endpoints (city, country, owner_id, lat, long, api_token) VALUES ($city, $country, $owner_id, $lat, $long, $api_token)')
  try {
    const apiToken = uuid()
    const insertion = insertStmt.run({
      city: req.body.city,
      country: req.body.country,
      owner_id: res.locals.user.id,
      lat: req.body.lat,
      long: req.body.long,
      api_token: apiToken
    })
    return res.status(201).send({
      message: `Endpoint with id ${insertion.lastInsertRowid} created`,
      data: {
        id: insertion.lastInsertRowid,
        city: req.body.city,
        country: req.body.country,
        owner_id: res.locals.user.id,
        lat: req.body.lat,
        long: req.body.long,
        api_token: apiToken
      }
    })
  } catch (error) {
    console.log(error)
    if (error.code.includes('UNIQUE')) return res.status(409).send({
      message: 'The provided combination of city and country already exists'
    })
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
});

router.get("/:endpoint", (req, res) => {
  const endpointStmt = db.prepare('SELECT id, city, country, lat, long, owner_id FROM endpoints WHERE id=$id')
  try {
    const endpoint = endpointStmt.get({ id: req.params.endpoint })
    if (!endpoint) return res.status(404).send({
      message: `Endpoint Not Found`
    })
    return res.status(200).send({
      message: 'Endpoint',
      data: {
        id: endpoint.id,
        city: endpoint.city,
        country: endpoint.country,
        owner_id: endpoint.owner_id,
        lat: endpoint.lat,
        long: endpoint.long
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.delete('/:endpoint', authentication, (req, res) => {
  const endpointStmt = db.prepare('SELECT * FROM endpoints WHERE id=$endpoint')
  const deleteStmt = db.prepare('DELETE FROM endpoints WHERE id=$endpoint')
  try {
    const endpoint = endpointStmt.get({
      endpoint: req.params.endpoint
    })
    if (!endpoint) return res.status(404).send({
      message: 'Endpoint Not Found'
    })
    if (endpoint.owner_id !== res.locals.user.id) return res.status(403).send({
      message: 'You can only delete your own endpoints'
    })
    const deletion = deleteStmt.run({
      endpoint: endpoint.id
    })
    res.status(204).send()
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.get("/:endpoint/currentData", (req, res) => {
  if (!req.params.endpoint) return res.status(400).send({
    message: "No endpoint provided"
  })
  const dataStmt = db.prepare('SELECT date, temperature, humidity FROM endpoint_data WHERE endpoint_id=$endpoint_id ORDER BY date DESC')
  try {
    const data = dataStmt.get({ endpoint_id: req.params.endpoint })
    if (!data) return res.status(404).send({
      message: 'Data Not Found'
    })
    return res.status(200).send({
      message: 'Current Data',
      data: {
        date: data.date,
        temperature: data.temperature,
        humidity: data.humidity
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.get("/:endpoint/data", (req, res) => {
  if (!req.params.endpoint) return res.status(400).send({
    message: "No endpoint provided"
  })
  const dataStmt = db.prepare('SELECT date, temperature, humidity FROM endpoint_data WHERE endpoint_id=$endpoint_id ORDER BY date ASC')
  try {
    const data = dataStmt.all({ endpoint_id: req.params.endpoint })
    if (!data) return res.status(404).send({
      message: 'Data Not Found'
    })
    return res.status(200).send({
      message: 'Data',
      data
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.post("/:endpoint/data", authentication, (req, res) => {
  if (!req.body.data || !req.params.endpoint) return res.status(400).send({
    message: 'No existing endpoint or valid data array provided'
  })
  const endpointStmt = db.prepare('SELECT id FROM endpoints WHERE name=$name')
  const insertStmt = db.prepare('INSERT INTO endpoint_data VALUES ($endpoint_id, $date, $temperature, $humidity)')
  const insertMany = db.transaction((entries, endpointId) => {
    for (const entry of entries) {
      insertStmt.run({
        endpoint_id: endpointId,
        date: entry.date,
        temperature: entry.date,
        humidity: entry.date
      })
    }
  })
  try {
    const endpoint = endpointStmt.get({ name: req.params.endpoint })
    if (!endpoint) return res.status(404).send({
      message: 'Endpoint Not Found'
    })
    insertMany(req.body.data, endpoint.id)
    return res.status(201).send({
      message: 'Data Created',
      data: req.body.data
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

router.get("/:endpoint/forecast", (req, res) => {
  if (!req.params.endpoint || req.query.minutes && (req.query.minutes < 1 || req.query.minutes > 60)) return res.status(400).send({
    message: "Invalid parameters"
  })
  const endpointStmt = db.prepare('SELECT id FROM endpoints WHERE id=$endpoint')
  const dataStmt = db.prepare('SELECT date, temperature, humidity FROM endpoint_data WHERE endpoint_id=$endpoint_id ORDER BY date DESC')
  try {
    const endpoint = endpointStmt.get({ endpoint: req.params.endpoint })
    if (!endpoint) return res.status(404).send({
      message: 'Endpoint Not Found'
    })
    const data = dataStmt.get({ endpoint_id: endpoint.id })
    if (!data) return res.status(404).send({
      message: 'Current Data Not Found'
    })
    const END = req.query.minutes ? req.query.minutes : 60;
    let weather = {
      temperature: data.temperature,
      humidity: data.humidity
    }
    const dateParts = data.date.split("-")
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
    return res.status(200).send({
      message: 'Forecast',
      data: output
    })
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      message: 'Internal Error'
    })
  }
})

export { router as EndpointRouter };
