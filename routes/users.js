const express = require('express');
const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const regExpUrl = require('../utils/validation');

const {
  getUser, getCurrentUser, getUserById, editProfile, editAvatar,
} = require('../controllers/users');

router.get('/users', express.json(), getUser);

router.get('/users/me', express.json(), getCurrentUser);

router.get('/users/:userId', express.json(), celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

router.patch('/users/me', express.json(), celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editProfile);

router.patch('/users/me/avatar', express.json(), celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExpUrl),
  }),
}), editAvatar);

module.exports = router;
