const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { ADMIN_ROLE, USER_ROLE } = require('../constants/user');

let userRoles = {
  values: [ADMIN_ROLE, USER_ROLE],
  message: '{VALUE} isn\'t a valid role',
}
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name required']
  },
  email: {
    type: String,
    index:{ unique: true },
    required: [true, 'email required']
  },
  pass: {
    type: String,
    required: [true, 'pass required']
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: userRoles,
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function() {
  const userJson = this.toObject();

  delete userJson.pass;

  return userJson;
}

userSchema.plugin( uniqueValidator, { message: '{PATH} already registered, please choose another one' } );

module.exports = mongoose.model('user', userSchema);
