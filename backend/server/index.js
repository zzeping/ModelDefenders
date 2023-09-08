// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const postgresql = require('../../database/postgresql')

const queries = require('./queries.js')

app.get('/exercises', async (req, res) => {
  const client = await postgresql.connect();
  client.query(queries.getModels, (error, results) => {
      client.release();
      if (error) throw error;
      res.status(200).send(results.rows);
    })
});

app.get('/', (req, res) => {
  res.send({message:'Hello World!'})
})

//Keep this at end of file
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});

