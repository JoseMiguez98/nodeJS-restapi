const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const validExtensions = ['jpg', 'jpeg', 'gif', 'png'];
const validTypes = ['user', 'product'];

const { verifyToken } = require('../middlewares/auth');

const User = require('../models/user');
const Product = require('../models/product');

function isValidExt(ext) {
  return validExtensions.includes(ext);
}

function isValidType(type) {
  return validTypes.includes(type);
}

function createProductImage(id, res, img) {
  Product.findByIdAndUpdate(id, { img }, (err, productDB) => {
    if (err) {
      deleteImage(img, 'product');

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!productDB) {
      deleteImage(img, 'product');

      return res.status(404).json({
        ok: false,
        message: 'Product not found',
      });
    }

    deleteImage(productDB.img, 'product');

    // Set img to return new product on response
    productDB.img = img;

    return res.json({
      ok: true,
      productDB,
      message: 'Image updated successfully',
    })
  });
}

function createUserImage(id, res, img) {
  User.findByIdAndUpdate(id, { img }, (err, userDB) => {

    if (err) {
      deleteImage(img, 'user');

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!userDB) {
      deleteImage(img, 'user');

      return res.status(404).json({
        ok: false,
        message: 'User not found',
      });
    }

    deleteImage(userDB.img, 'user');

    // Set img to return new user on response
    userDB.img = img;

    return res.json({
      ok: true,
      userDB,
      message: 'Image updated successfully',
    });
  });
}

function deleteImage(img, type) {
  const imgPath = path.resolve(__dirname, `../../uploads/${type}/${img}`);

  if(fs.existsSync(imgPath)) {
    fs.unlinkSync(imgPath);
    return true;
  }

  return false;
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
      deleteImage(fileName, type);

      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(type === 'user') {
      createUserImage(id, res, fileName);
    } else {
      createProductImage(id, res, fileName);
    }
  });
});

module.exports = app;
