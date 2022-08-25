const express = require('express');
const mongoose = require('mongoose');

const { NOT_FOUND_CODE } = require('./utils/constants');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6303bc5cc8b572ec0e3fd3ac',
  };

  next();
});

app.use(userRouter);

app.use(cardRouter);

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Страница не найдена' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
