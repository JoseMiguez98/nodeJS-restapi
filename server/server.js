require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// body parser requests middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => (
   res.json({ message: 'hello world' })
));

app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    id,
    message: 'user get'
  });
})

app.post('/user/:id', (req, res) => {
  const id = req.params.id;
  const userData = req.body;

  if (userData.name) {
    res.json({
      id,
      message: 'user post',
      userData,
    });
  } else {
    res.status(400);
    res.send({
      success: false,
      message: 'Name is required',
    });
  }
})

app.put('/user/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    id,
    message: 'user put'
  })
})

app.delete('/user/:id', (req, res) => {
  const id = req.params.id;
  res.json({
    id,
    message: 'user delete'
  })
})

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));