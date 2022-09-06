const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { NOT_FOUND_CODE } = require('./utils/constants');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());

app.post('/signup', express.json(), createUser);
app.post('/signin', express.json(), login);
app.use(auth);
app.use(userRouter);
app.use(cardRouter);

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Страница не найдена' });
});

app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode === undefined) {
    const { statusCode = 500, message } = err;
    return res.status(statusCode).send({
      message: statusCode === 500
        ? 'Внутренняя ошибка сервера'
        : message,
    });
  }
  next();
  return res.status(err.statusCode).send({ message: err.message });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
