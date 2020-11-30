var mongoose = require('mongoose');
var { Schema } = mongoose;

var productSchema = new Schema({
    name: {
      type: String,
      required: [true, 'name required'],
      index:{ unique: true }
    },
    priceUnit: {
      type: Number,
      required: [true, 'price unit required'],
    },
    description: {
      type: String,
      required: false,
    },
    available: {
      type: Boolean,
      required: true,
      default: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    img: {
      type: String,
    }
});

module.exports = mongoose.model('product', productSchema);
