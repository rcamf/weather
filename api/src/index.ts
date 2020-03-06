import cors from "cors";
import express from "express";
import fs from "fs";
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

// app.get('/api/getNextData', (req, res) => {
//   fs.readdir("../data", (direrr, files) => {
//     if (direrr) {
//       res.sendStatus(500);
//     } else {
//       files.sort((a, b) => (a < b ? 1 : -1));
//       fs.readFile(path.join("../data", files[0]), "utf8", (fileerr, data) => {
//         if (fileerr) {
//           res.sendStatus(501);
//         } else {
//           const weather = JSON.parse(data);
//           const output = []
//           let slopeTemp = Math.floor(Math.random() * 3) - 1;
//           for (let i = 0; 0 < 60; i++) {
//             if (i % 5 == 0) {
//               slopeTemp = Math.floor(Math.random() * 3) - 1;
//             }
//             output.push()
//           }
//         }
//       });
//     }
//   });
// })

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
