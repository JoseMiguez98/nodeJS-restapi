const express = require('express');
const { verifyToken } = require('../middlewares/auth');
const Product = require('../models/product');
const app = express();

app.get('/product', verifyToken, (req, res) => {

  Product.find({ available: true })
  .sort('name')
  .populate('user', 'name email')
  .populate('category')
  .exec((err, products) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    Product.count()
    .exec((err, count) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      return res.json({
        count,
        ok: true,
        products,
      });
    });
  });
});

app.get('/product/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  Product.findById(id)
  .populate('user', 'name email')
  .populate('category')
  .exec((err, productDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!productDB) {
      return res.status(404).json({
        ok: false,
        err: 'Product not found'
      });
    }

    return res.json({
      ok: true,
      productDB,
    });
  });
});

app.get('/product/search/:term', verifyToken, (req, res) => {
  const { term } = req.params;
  const regex = new RegExp(term, 'i');

  Product.find({ name: regex })
  .populate('user', 'name email')
  .populate('category')
  .exec((err, products) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      products,
    });
  });
});

app.post('/product', verifyToken, (req, res) => {
  const {
    name,
    priceUnit,
    description,
    available,
    category,
  } = req.body;
  const { _id } = req.user;
  const product = new Product({
    name,
    priceUnit,
    description,
    available,
    user: _id,
    category,
  });

  product.save((err, productDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!productDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      productDB,
    });
  });
});

app.put('/product/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { body } = req;

  Product.findByIdAndUpdate(id, body, {
    context: 'query',
    new: true,
    runValidators: true,
  }, (err, productDB) => {

    if(err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!productDB) {
      return res.status(404).json({
        ok: false,
        err: 'Product not found',
      });
    }

    return res.json({
      ok: true,
      productDB,
    });
  });
});

app.delete('/product/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  Product.findByIdAndUpdate(id, { available: false }, (err, productDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!productDB) {
      return res.status(404).json({
        ok: false,
        err: 'Product not found',
      });
    }

    return res.json({
      ok: true,
      productDB,
    });
  });
});

module.exports = app;
