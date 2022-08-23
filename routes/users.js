const express = require('express');
const router = require('express').Router();
const { createUser, getUser, getUserById } = require('../controllers/users');

router.get('/users', express.json(), getUser);
router.get('/users/:userId', express.json(), getUserById);
router.post('/users', express.json(), createUser);

module.exports = router;
