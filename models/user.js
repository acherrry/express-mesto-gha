const validator = require('validator');
const mongoose = require('mongoose');
const regExpUrl = require('../utils/validation');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return regExpUrl.test(url);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(e) {
        return validator.isEmail(e);
      },
    },
  },
  password: {
    select: false,
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
