const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/login', (req, res) => {
  const { email, pass } = req.body;

  User.findOne({ email }, (err, userDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!userDB) {
      return res.status(400).json({
        ok: false,
        message: '(Email) or password invalid',
      });
    }

    if(!bcrypt.compareSync(pass, userDB.pass)) {
      return res.status(400).json({
        ok: false,
        message: 'Email or (password) invalid',
      });
    }
    const token = jwt.sign(
      { userDB },
      process.env.JWT_SEED,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    return res.json({
      ok: true,
      userDB,
      token,
    })
  });
});

module.exports = app;
