// Подключаем express
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

//  Настроим порт, который должен слушать приложение
const { PORT = 3000 } = process.env;

// Создаем приложение
const app = express();

const validator = require('validator');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const {
  createUser,
  login,
} = require('./controllers/users');

// валидация ссылок
const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

const auth = require('./middlewares/auth');

// подключаемся к серверу mongo. Имя бд  - mestodb.
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => { console.log('Connected to MongoDb!'); })
  .catch((err) => {
    console.log('No connection. Error:', err);
  });

// парсер для обработки тела запроса в PUT
app.use(express.json());

// роут для регистрации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(method),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

// роут для аутентификации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

// защита авторизацией всех роутов строками ниже
app.use(auth);

// console.log(auth);

//  подключаем роуты
app.use('/', userRouter); //  localhost:PORT/ + userRouter
app.use('/', cardRouter); //  localhost:PORT/ + cardRouter

// ошибка роутеризации
app.use((req, res, next) => {
  const notFound = new Error('Ресурс не найден');
  notFound.statusCode = 404;
  next(notFound);
});

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки централизованно
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || `Ошибка на стороне сервера, ${err}`;
  res.status(statusCode).send(message);

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
