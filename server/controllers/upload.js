const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/auth');
const validExtensions = ['jpg', 'jpeg', 'gif', 'png'];

function isValidExt(ext) {
  return validExtensions.includes(ext);
}

app.put('/upload', verifyToken, (req, res) => {

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: 'No files were uploaded',
    });
  }

  const { file } = req.files;
  const fileNameSplitted = file.name.split('.');
  const fileExt = fileNameSplitted[fileNameSplitted.length - 1];

  if(!isValidExt(fileExt)) {
    return res.status(400).json({
      ok: false,
      err: `Not a valid extension, extensions suportted are [${ validExtensions.join(', ') }] but you sent a '.${ fileExt }' instead`,
    });
  }

  file.mv(`uploads/${file.name}`, (err) => {

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
