const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const { verifyURLToken } = require('../middlewares/auth');

app.get('/image/:type/:img', verifyURLToken, (req, res) => {
  const { type, img } = req.params;
  const imagePath = path.resolve(__dirname, `../../uploads/${ type }/${ img }`);
  let noImagePath;
  console.log(imagePath);

  if(fs.existsSync(imagePath)) {
    return res.sendFile(imagePath);
  } else {
    noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    return res.sendFile(noImagePath);
  }
});

module.exports = app;
