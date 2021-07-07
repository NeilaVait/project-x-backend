require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ShopCategory = require('./models/category');

const app = express();

const PORT = 4000;

// prisijungimas prie duomenu bazes
mongoose
  .connect(process.env.MONGO_CONNECT_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Conneced to Mongoose');
  })
  .catch((err) => console.error(err.message));

// MIddleware
app.use(morgan('dev'));
// leidzia req body gauti kaip json
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json(`Serveris veikia an port ${PORT}`);
});

// routes
const catRoutes = require('./routes/catRoutes');
app.use('/', catRoutes);

app.listen(PORT, console.log(`Back end online on port ${PORT}`));
