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
      if (
        req.query.minutes &&
        req.query.minutes <= 60 &&
        !(req.query.minutes <= 0)
      ) {
        END = req.query.minutes;
      } else if (req.query.minutes) {
        res.sendStatus(400);
        return;
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
      res.send(output);
    }
  });
});

app.get("/api/getNextData", (req, res) => {
  let END = 60;
  if (
    req.query.minutes &&
    req.query.minutes <= 60 &&
    !(req.query.minutes <= 0)
  ) {
    END = req.query.minutes;
  } else if (req.query.minutes) {
    res.sendStatus(400);
    return;
  }
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
          let slopeTemp = Math.floor(Math.random() * 3) - 1 + Math.random() < 0.5 ? -0.1 : 0.1;
          let slopeHum = Math.floor(Math.random() * 3) - 1 + Math.random() < 0.5 ? -0.1 : 0.1;
          for (let i = 0; i < END; i++) {
            currentDate.setMinutes(currentDate.getMinutes() + 1); // Nächstes Datum
            if (i % (Math.floor(Math.random() * 3) + 3) === 0) {
              slopeTemp = Math.floor(Math.random() * 3) - 1 + Math.random() < 0.5 ? -0.1 : 0.1;
              slopeHum = Math.floor(Math.random() * 3) - 1 + Math.random() < 0.5 ? -0.1 : 0.1;
            }
            weather = {
              temperature:
                weather.temperature + (Math.random() / 25) * slopeTemp,
              humidity: weather.humidity + (Math.random() / 55) * slopeHum
            };
            output.push({
              date:
                currentDate.getFullYear() + "-" +(currentDate.getMonth() + "-").padStart(3, '0') + (currentDate.getDate()  + "-").padStart(3, '0') + (currentDate.getHours() + "-").padStart(3, '0') + (currentDate.getMinutes() + "").padStart(2, '0'),
              temperature: weather.temperature.toFixed(4),
              humidity: weather.humidity.toFixed(4)
            });
          }
          res.send(output);
        }
      });
    }
  });
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
