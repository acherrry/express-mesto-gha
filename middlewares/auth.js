const jwt = require('jsonwebtoken');
const { INCORRECT_EMAIL_OR_PASSWORD } = require('../utils/constants');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(INCORRECT_EMAIL_OR_PASSWORD).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;

  return next();
};

module.exports = auth;
