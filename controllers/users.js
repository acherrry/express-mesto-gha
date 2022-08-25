const User = require('../models/user');

const {
  ERROR_DATA_CODE, NOT_FOUND_CODE, SERVER_ERROR_CODE, REQUEST_OK, CREATED_RESOURCE,
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
  try {
    const user = await User.create(req.body);
    return res.status(CREATED_RESOURCE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
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
    return res.status(REQUEST_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным ID не найден' });
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
    return res.status(REQUEST_OK).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
    }
    if (err.name === 'CastError') {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь с указанным ID не найден' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  editProfile,
  editAvatar,
};
