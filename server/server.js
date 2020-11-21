// Set ENV variables
require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Require Database
const db = require('./db/db');

// Connect to database
db.connect();

// Config global controllers
app.use( require('./controllers') );

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
