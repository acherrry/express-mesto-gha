const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Чтобы выполнить действия, пожалуйста, авторизуйтесь'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
