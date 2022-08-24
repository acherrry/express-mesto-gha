const User = require('../models/user');

const ERROR_DATA_CODE = 400;
const NOT_FOUND_CODE = 404;
const ERROR_CODE = 500;

const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Пользователь по указанному ID не найден' });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Невалидные переданные данные' });
    }
    return res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
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
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
    }
    return res.status(ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  editProfile,
};
