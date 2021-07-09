const express = require('express');
const User = require('../models/user');
const router = express.Router();

// create new user
router.post('/api/shop/users/new', async (req, res) => {
  const newUserData = {
    name: 'Clark Glass',
    email: 'clark@glass.com',
    password: '1234',
  };

  const newUser = new User(newUserData);

  try {
    const result = await newUser.save();
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }

  // newUser
  //   .save()
  //   .then((result) => res.json(result))
  //   .catch((err) => console.log(err));
});

// get all users
router.get('/api/shop/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get single user
router.get('/api/shop/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
