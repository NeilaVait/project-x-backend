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
app.use(express.json());

app.get('/', (req, res) => res.status(200).json(`Serveris veikia ant porto ${PORT}`));

app.post('/api/shop/categories/new', (req, res) => {
  // gauti is userio title
  console.log(req.body);
  const titleFromUser = req.body.title;
  // su gautu title sukurti nauja kategorija
  if (!titleFromUser) return res.status(400).json('no title');
  const newCategory = new Category({ title: titleFromUser });

  newCategory
    .save()
    .then((result) => res.json(['category created', result]))
    .catch((err) => res.status(500).json('internal error'));
});

app.listen(PORT, () => {
  console.log(`Back end online on port ${PORT}`);
});
