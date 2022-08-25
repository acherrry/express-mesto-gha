const Card = require('../models/card');

const {
  ERROR_DATA_CODE, NOT_FOUND_CODE, SERVER_ERROR_CODE, REQUEST_OK, CREATED_RESOURCE,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(REQUEST_OK).send(cards);
  } catch (err) {
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const deleteCardById = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Карточка с указанным ID не найдена' });
    }
    return res.status(REQUEST_OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Невалидные переданные данные' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const userId = req.user._id;
    const card = await Card.create({
      name, link, owner: userId,
    });
    return res.status(CREATED_RESOURCE).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные для создания карточки' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const likeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card
      .findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true });
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Передан несуществующий ID карточки.' });
    }
    return res.status(REQUEST_OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card
      .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true });
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Передан несуществующий ID карточки' });
    }
    return res.status(REQUEST_OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(ERROR_DATA_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
    }
    return res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка на сервере' });
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
};
