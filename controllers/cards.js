const Card = require('../models/card');

const { OK, CREATED } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const NotFoundError = require('../errors/not-found-err');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(OK).send(cards);
  } catch (err) {
    return next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      throw new NotFoundError('Карта с указанным ID не найдена');
    }
    const cardUserId = card.owner;
    const cardUserIdString = cardUserId.toString();
    if (userId !== cardUserIdString) {
      throw new ForbiddenError('Удалить карту, созданную не Вами, невозможно');
    }
    await Card.deleteMany(card);
    return res.status(OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Невалидные переданные данные для удаления карты'));
    }
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const userId = req.user._id;
    const card = await Card.create({
      name, link, owner: userId,
    });
    return res.status(CREATED).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные для создания карты'));
    }
    return next(err);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card
      .findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true });
    if (!card) {
      throw new NotFoundError('Передан несуществующий ID карточки.');
    }
    return res.status(OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
    }
    return next(err);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card
      .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true });
    if (!card) {
      throw new NotFoundError('Передан несуществующий ID карточки');
    }
    return res.status(OK).send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
    }
    return next(err);
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  dislikeCard,
};
