const ENV = require('./constants');

/*
===========================
 Process config
===========================
*/

 process.env.PORT = process.env.PORT || 3000;

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
