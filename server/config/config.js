const ENV = require('./constants');

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

process.env.JWT_EXPIRE = 60*60*24*30;

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
