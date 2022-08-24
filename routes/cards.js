const express = require('express');
const router = require('express').Router();
const {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.post('/cards', express.json(), createCard);
router.get('/cards', express.json(), getCards);
router.delete('/cards/:cardId', express.json(), deleteCardById);
router.put('/cards/:cardId/likes', express.json(), likeCard);
router.delete('/cards/:cardId/likes', express.json(), dislikeCard);

module.exports = router;
