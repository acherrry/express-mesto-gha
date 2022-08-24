const express = require('express');
const router = require('express').Router();
const {
  getUser, getUserById, createUser, editProfile, editAvatar,
} = require('../controllers/users');

router.get('/users', express.json(), getUser);
router.get('/users/:userId', express.json(), getUserById);
router.post('/users', express.json(), createUser);
router.patch('/users/me', express.json(), editProfile);
router.patch('/users/me/avatar', express.json(), editAvatar);

module.exports = router;
