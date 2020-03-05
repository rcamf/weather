import express from 'express';

const app = express();
const port = 8080; // default port to listen

// define a route handler for the default home page
app.get('/', (req, res) => {
  res.send({
    temperature: 20,
    rainHours: 3,
  });
});

// route handler for a sub page
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
