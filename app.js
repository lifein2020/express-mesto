// Подключаем express
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

//  Настроим порт, который должен слушать приложение
const { PORT = 3000 } = process.env;

// Создаем приложение
const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const {
  createUser,
  login,
} = require('./controllers/users');

const auth = require('./middlewares/auth');

// подключаемся к серверу mongo. Имя бд  - mestodb.
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
}) /*  , err => {
  if(err) throw err;
  console.log('Connected to MongoDb!')
}) */
  .then(() => { console.log('Connected to MongoDb!'); })
  .catch((err) => {
    console.log('No connection. Error:', err);
  });

// парсер для обработки тела запроса в PUT
app.use(express.json());
//  deprecated
/*  app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); */

// роут для регистрации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
}), createUser);

// роут для логина
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    paswword: Joi.string().required(),
  }),
}), login);

// app.use(Authorized); // все роуты ниже этой строки будут защищены

app.use(auth);

//  подключаем роуты
app.use('/', userRouter); //  localhost:PORT/ + userRouter
app.use('/', cardRouter); //  localhost:PORT/ + cardRouter
app.use((req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});
// либо
//  The 404 Route (ALWAYS Keep this as the last route)
/*  app.get('*', (req, res) => {
  res.status(404).send('Ресурс не найден');
}); */

// обработчик ошибок celebrate
app.use(errors());

// здесь обрабатываем все ошибки централизованно

app.use((err, req, res, next) => {
  // console.log(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || `Ошибка на стороне сервера, ${err}`;
  res.status(statusCode).send({ message: message });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
