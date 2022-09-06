const express = require('express');
const router = require('express').Router();
const {
  getUser, getCurrentUser, getUserById, editProfile, editAvatar,
} = require('../controllers/users');

router.get('/users', express.json(), getUser);
router.get('/users/me', express.json(), getCurrentUser);
router.get('/users/:userId', express.json(), getUserById);
router.patch('/users/me', express.json(), editProfile);
router.patch('/users/me/avatar', express.json(), editAvatar);

module.exports = router;
