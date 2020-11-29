const ENV = require('./constants');
const app = require('express')();
const path = require('path');
const transformMiddleware = require('express-transform-bare-module-specifiers').default;

// Using a custom rootDir and modulesUrl:
app.use('*', transformMiddleware({
  modulesUrl: path.resolve(`${__dirname}/../node_modules`),
}))

/*
===========================
 Process config
===========================
*/

 process.env.PORT = process.env.PORT || 3000;

/*
===========================
JWT Expire time
===========================
*/

process.env.JWT_EXPIRE = '48h';

/*
===========================
JWT Seed
===========================
*/

process.env.JWT_SEED = process.env.JWT_SEED || 'dev-seed';

/*
===========================
 Database url config
===========================
*/

if(process.env.NODE_ENV === ENV.PROD) {
  process.env.URLDB = process.env.MONGO_URI;
} else {
  process.env.URLDB = 'mongodb://localhost:27017/coffee-udemy';
}

/*
===========================
 Google CLIENT_ID
===========================
*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '277308241713-l4hh12h0dj13o2arnv4cr66ontl494mf.apps.googleusercontent.com';
