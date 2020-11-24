const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const User = require('../models/user');
const user = require('../constants/user');
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

    const token = jwt.sign( { userDB }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRE });

    return res.json({
      ok: true,
      userDB,
      token,
    });
  });
});

// Google auth
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const { name, email } = ticket.getPayload();

  return { name, email };
}

app.post('/google', async (req, res) => {
  const { id_token } = req.body;

  const googleUser = await verify(id_token).catch(err => {
    //Google token invalid
    return res.status(500).json({
      ok: false,
      err,
    });
  });

  const { email, name } = googleUser;

  User.findOne({ email }, (err, userDB) => {
    if(err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(userDB) {
      //User exists in DB
      if(!userDB.google) {
        //User already registered without google
        return res.status(400).json({
          ok: false,
          err: {
            message: 'User already registered without Google',
          },
        });
      }
      // User registered with google
      const token = jwt.sign({ userDB }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRE });

      return res.json({
        ok: true,
        userDB,
        token,
      });
    }
    // User doesn't exists in database
    let newUser = new User();

    newUser.name = name;
    newUser.email = email;
    newUser.google = true;
    newUser.pass = ':)';

    newUser.save((err, userDB) => {
      if(err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      const token = jwt.sign({ userDB }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRE });

      return res.json({
        ok: true,
        userDB,
        token,
      });
    });
  });
});

module.exports = app;
