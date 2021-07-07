const express = require('express');
const app = express();

const mongoose = require('mongoose');
const { mongoDbString } = require('./config/config');

const port = 4000;

mongoose
  .connect(mongoDbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    console.log('Serveris veikia');
    app.listen(3000);
  })
  .catch((err) => console.error(err.message));

app.get('/', (req, res) => res.render('index'));

app.listen(port, () => {
  console.log(`Serveris veikia ${port}`);
});
