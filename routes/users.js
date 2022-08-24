const express = require('express');
const router = require('express').Router();
const {
  getUser, getUserById, createUser, editProfile,
} = require('../controllers/users');

router.get('/users', express.json(), getUser);
router.get('/users/:userId', express.json(), getUserById);
router.post('/users', express.json(), createUser);
router.patch('/users/me', express.json(), editProfile);

module.exports = router;
