// Set ENV variables
require('./config/config');

const express = require('express');
const app = express();

// Require Database
const db = require('./db/db');

// Connect to database
db.connect();

// Use user controller routes
app.use( require('./controllers/user') );

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));