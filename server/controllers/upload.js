const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/auth');
const validExtensions = ['jpg', 'jpeg', 'gif', 'png'];
const validTypes = ['user', 'product'];

function isValidExt(ext) {
  return validExtensions.includes(ext);
}

function isValidType(type) {
  return validTypes.includes(type);
}

app.put('/upload/:type/:id', verifyToken, (req, res) => {
  const { file } = req.files;
  const { type, id } = req.params;
  let fileName;
  let fileExt;
  let fileNameSplitted;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      err: 'No files were uploaded',
    });
  }

  if(!isValidType(type)) {
    return res.status(400).json({
      ok: false,
      err: `Not a valid type, suportted types are [${ validTypes.join(', ') }] but you sent '${ type }' instead`,
    })
  }

  fileNameSplitted = file.name.split('.');
  fileExt = fileNameSplitted[fileNameSplitted.length - 1];

  if(!isValidExt(fileExt)) {
    return res.status(400).json({
      ok: false,
      err: `Not a valid extension, extensions suportted are [${ validExtensions.join(', ') }] but you sent a '.${ fileExt }' instead`,
    });
  }

  fileName = `${ id }-${ new Date().getMilliseconds() }.${ fileExt }`;

  file.mv(`uploads/${ type }/${ fileName }`, (err) => {

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
