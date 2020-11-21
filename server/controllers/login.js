const express = require('express');
const bcrypt = require('bcrypt');
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

    return res.json({
      ok: true,
      userDB,
    })
  });
});

module.exports = app;
