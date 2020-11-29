const express = require('express');
const Category = require('../models/category');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');
const app = express();

app.get('/category', verifyToken, (req, res) => {

  Category.find()
  .exec((err, categories) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    Category.count()
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
        categories,
      });

    });
  });
});

app.get('/category/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  Category.findById(id)
  .exec((err, category) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!category) {
      return res.status(404).json({
        ok: false,
        err: 'Category not found',
      });
    }

    return res.json({
      ok: true,
      category,
    });
  });
});

app.post('/category', [verifyToken,  verifyAdminRole], (req, res) => {
  const { name } = req.body;
  const { _id } = req.user;
  console.log(_id);
  const category = new Category({
    name,
    user: _id,
  });

  category.save((err, categoryDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoryDB) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      categoryDB,
    });
  });
});

app.put('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  Category.findByIdAndUpdate(id, { name }, {
    context: 'query',
    new: true,
    runValidators: true,
  }, (err, categoryDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if (!categoryDB) {
      return res.status(404).json({
        ok: false,
        err: 'Category not found',
      });
    }

    return res.json({
      ok: true,
      categoryDB,
    });
  });
});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
  const { id } = req.params;

  Category.findByIdAndRemove(id, (err, categoryDB) => {

    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    if(!categoryDB) {
      return res.status(404).json({
        ok: false,
        err: 'Category not found',
      });
    }

    return res.json({
      ok: true,
      categoryDB,
    });
  });
});

module.exports = app;
