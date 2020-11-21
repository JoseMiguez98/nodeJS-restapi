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
  process.env.URLDB = 'mongodb+srv://JoseMiguez98:Fsociety505;@cluster0.qibwv.mongodb.net/coffee-udemy?retryWrites=true&w=majority'
} else {
  process.env.URLDB = 'mongodb://localhost:27017/coffee-udemy';
}
