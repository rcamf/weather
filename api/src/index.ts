import cors from 'cors';
import express from 'express';

const app = express();
const port = 8080; // default port to listen

app.use(cors());

// Standard-URL, wenn man einfach auf `localhost:8080` navigiert
app.get('/', (req, res) => {
  res.send({
    temperature: 20,
    rainHours: 3,
  });
});

// Erreichbar unter `localhost:8080/example-sub-route`
// Könnt ihr natürlich löschen, falls ihr es später nicht mehr braucht
app.get('/example-sub-route', (req, res) => {
  res.send({
    temperature: 15,
    rainHours: 17,
  });
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
