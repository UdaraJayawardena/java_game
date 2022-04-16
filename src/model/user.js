/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const user = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required:false,
  },
  lastName: {
    type: String,
    required: false,
  },
  age: {
    type: String,
    required: false,
  },
}, {
  collection: 'user',
});

module.exports = mongoose.model('user', user);
