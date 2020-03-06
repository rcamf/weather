import cors from "cors";
import express from "express";
import fs, { read } from "fs";
import path from "path";

const app = express();
const port = 8080;

app.use(cors());

// API-URL
app.get("/api/getCurrentData", (req, res) => {
  fs.readdir("../data", (direrr, files) => {
    if (direrr) {
      res.sendStatus(500);
    } else {
      files.sort((a, b) => (a < b ? 1 : -1));
      fs.readFile(path.join("../data", files[0]), "utf8", (fileerr, data) => {
        if (fileerr) {
          res.sendStatus(501);
        } else {
          const weather = JSON.parse(data);
          res.send({
            date: files[0],
            temperature: weather.temperature,
            humidity: weather.humidity
          });
        }
      });
    }
  });
});

app.get("/api/getData", (req, res) => {
  fs.readdir("../data", (direrr, files) => {
    if (direrr) {
      res.sendStatus(500);
    } else {
      let END = 60;
      if (req.query.minutes && req.query.minutes <= 60) {
        END = req.query.minutes;
      }
      const tmpFiles = files
        .sort((a, b) => (a < b ? 1 : -1))
        .slice(0, END)
        .sort((a, b) => (a > b ? 1 : -1));
      const output = tmpFiles.map(file => {
        const data = fs.readFileSync(path.join("../data", file), "utf8");
        const weather = JSON.parse(data);
        return {
          date: file,
          temperature: weather.temperature,
          humidity: weather.humidity
        };
      });
      output.length ? res.send(output) : res.sendStatus(400);
    }
  });
});

app.get("/api/getNextData", (req, res) => {
  let MINUTES = 60;
  if (req.query.minutes && req.query.minutes > 0 && req.query.minutes <= 60) {
    MINUTES = req.query.minutes;
  } else if (req.query.minutes <= 0 || req.query.minutes > 60) {
    res.sendStatus(400);
  } else {
    fs.readdir("../data", (direrr, files) => {
      if (direrr) {
        res.sendStatus(500);
      } else {
        files.sort((a, b) => (a < b ? 1 : -1));
        fs.readFile(path.join("../data", files[0]), "utf8", (fileerr, data) => {
          if (fileerr) {
            res.sendStatus(501);
          } else {
            let weather = JSON.parse(data);
            const dateParts = files[0].split("-");
            const currentDate = new Date(
              parseInt(dateParts[0], 10),
              parseInt(dateParts[1], 10),
              parseInt(dateParts[2], 10),
              parseInt(dateParts[3], 10),
              parseInt(dateParts[4], 10)
            );
            const output = [];
            let slopeTemp = Math.floor(Math.random() * 3) - 1;
            let slopeHum = Math.floor(Math.random() * 3) - 1;
            for (let i = 0; i < MINUTES; i++) {
              currentDate.setMinutes(currentDate.getMinutes() + 1); // Nächstes Datum
              if (i % (Math.floor(Math.random() * 3) + 4) === 0) {
                slopeTemp = Math.floor(Math.random() * 3) - 1;
                slopeHum = Math.floor(Math.random() * 3) - 1;
              }
              weather = {
                temperature:
                  weather.temperature + (Math.random() / 25) * slopeTemp,
                humidity: weather.humidity + (Math.random() / 55) * slopeHum
              };
              output.push({
                date:
                  currentDate.getFullYear() +
                  "-" +
                  (currentDate.getMonth() < 10
                    ? "0" + currentDate.getMonth()
                    : currentDate.getMonth()) +
                  "-" +
                  (currentDate.getDate() < 10
                    ? "0" + currentDate.getDate()
                    : currentDate.getDate()) +
                  "-" +
                  (currentDate.getHours() < 10
                    ? "0" + currentDate.getHours()
                    : currentDate.getHours()) +
                  "-" +
                  (currentDate.getMinutes() < 10
                    ? "0" + currentDate.getMinutes()
                    : currentDate.getMinutes()),
                temperature: weather.temperature.toFixed(2),
                humidity: weather.humidity.toFixed(2)
              });
            }
            res.send(output);
          }
        });
      }
    });
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
