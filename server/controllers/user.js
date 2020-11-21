const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/user');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/user', (req, res) => {

  const from = Number(req.query.from) || 0;
  const limit =  Number(req.query.limit) || 0;

  User.find({ state: true }, 'name state role email')
  .skip(from)
  .limit(limit)
  .exec((err, users) => {

    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    }

    User.count({ state: true })
    .skip(from)
    .limit(limit)
    .exec((err, count) => {

      if (err) {
        res.status(400).json({
          ok: false,
          err,
        });
      }

      res.json({
        count,
        ok: true,
        users,
      });
    });

  });
});

app.get('/user/:id', (req, res) => {
  const id = req.params.id;

  User.find({ _id: id })
  .exec((err, user) => {

    if(err) {
      res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      user,
    });
  })
});

app.post('/user', (req, res) => {
  const {
    email,
    google,
    img,
    name,
    pass,
    role,
    state,
  } = req.body;

  let user = new User({
    email,
    google,
    img,
    name,
    pass: bcrypt.hashSync(pass, 10),
    role,
    state,
  });

  user.save((err, userDB) => {
    if(err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    // userDB.pass = null;

    res.json({
      ok: true,
      userDB,
    });
  });
});

app.put('/user/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, [
    'email',
    'img',
    'name',
    'role',
    'state',
  ]);

  User.findByIdAndUpdate(id, body, {
    context: 'query',
    new: true,
    runValidators: true,
  }, (err, userDB) => {
    if(err) {
      res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      userDB,
    });
  })
});

app.delete('/user/:id', (req, res) => {
  const id = req.params.id;

  User.findByIdAndUpdate(id, { state: false }, { new: true } , (err, user) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!user) {
      res.status(404).json({
        ok: false,
        err: {
          message: 'User not found',
        },
      });
    }

    user.state = false;

    res.json({
      ok: true,
      user,
    });
  })
});

module.exports = app;
