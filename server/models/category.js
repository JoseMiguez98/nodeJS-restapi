const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'name required'],
    index: { unique: true },
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
  }
});

categorySchema.plugin(uniqueValidator, '{PATH} already registered, please choose another one');

module.exports = mongoose.model('category', categorySchema);
