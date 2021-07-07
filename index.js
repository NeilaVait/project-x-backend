require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const PORT = 4000;
const Category = require('./models/category');

mongoose
  .connect(process.env.MONGO_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log('connected to mongoose');
  })
  .catch((err) => console.error(err.message));

// middleware
app.use(morgan('dev'));

app.get('/', (req, res) => res.status(200).json(`Serveris veikia ant porto ${PORT}`));

app.get('/shop/categories/new', (req, res) => {
  const newCategory = new Category({
    title: 'Denim',
  });
  newCategory
    .save()
    .then((result) => res.send(result))
    .catch((err) => console.error(err.message));
});

app.listen(PORT, () => {
  console.log(`Back end online on port ${PORT}`);
});
