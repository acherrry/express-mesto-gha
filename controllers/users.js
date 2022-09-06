const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ERROR_DATA_CODE, INCORRECT_EMAIL_OR_PASSWORD, NOT_FOUND_CODE,
  USED_EMAIL, SERVER_ERROR_CODE, REQUEST_OK, CREATED_RESOURCE,
} = require('../utils/constants');

const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(REQUEST_OK).send(users);
  } catch (err) {
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному ID не найден' });
    }
    return res.status(REQUEST_OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Невалидные переданные данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const createUser = async (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    return res.status(CREATED_RESOURCE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    } if (err.name === 'Error') {
      return res.status(USED_EMAIL).send({ message: 'При регистрации указан email, который занял другой пользователь' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(INCORRECT_EMAIL_OR_PASSWORD).send({ message: 'Передан неверный email или пароль' });
    }
    const comparablePassword = await bcrypt.compare(password, user.password);
    if (!comparablePassword) {
      return res.status(INCORRECT_EMAIL_OR_PASSWORD).send({ message: 'Передан неверный email или пароль' });
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key');

    res.cookie('jwt', token, {
      expiresIn: 604800,
      httpOnly: true,
    });
    return res.status(REQUEST_OK).send({
      _id: user._id, name: user.name, about: user.about, avatar: user.avatar, email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные для авторизации' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const getCurrentUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному ID не найден' });
    }
    return res.status(REQUEST_OK).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Невалидные переданные данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User
      .findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true });
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным ID не найден' });
    }
    return res.status(REQUEST_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    if (err.name === 'CastError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Передан некорректный ID' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const editAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User
      .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true });
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным ID не найден' });
    }
    return res.status(REQUEST_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    if (err.name === 'CastError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Передан некорректный ID' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  getUser,
  getCurrentUser,
  getUserById,
  createUser,
  login,
  editProfile,
  editAvatar,
};
