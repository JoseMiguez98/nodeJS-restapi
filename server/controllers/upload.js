const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/auth');

app.put('/upload', verifyToken, (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: 'No files were uploaded',
    });
  }

  let { file } = req.files;

  file.mv('uploads/filename.jpg', (err) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      message: 'File uploaded successfully',
    });
  });
});

module.exports = app;
