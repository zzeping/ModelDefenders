// server/index.js

const express = require("express");
const cors = require('cors');
// const postgresql = require('../database/postgresql')

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


// app.get('/exercises', async (req, res) => {
//   const client = await postgresql.connect();
//   client.query(
//     `SELECT * FROM model`
//     , (error, results) => {
//       client.release();
//       if (error) throw error;
//       res.status(200).send(results.rows);
//       // console.log('Query result:', results.rows);

//     })
// });

app.use('/api/user', require('./routes/userRoutes'));

//Keep this at end of file
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});

