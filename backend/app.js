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
app.use(express.static("uploads"));


app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/model', require('./routes/modelRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));
app.use('/api/mutant', require('./routes/mutantRoutes'));

//Keep this at end of file
app.listen(PORT, () => {
console.log(`Server listening on ${PORT}`);
});

