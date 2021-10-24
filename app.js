// Подключаем express
const express = require('express');
const mongoose = require('mongoose');

//  Настроим порт, который должен слушать приложение
const { PORT = 3000 } = process.env;

// Создаем приложение
const app = express();

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

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

// временное решение авторизации (мидлвера перед роутамиы)
app.use((req, res, next) => {
  req.user = {
    _id: '616d1df1716f53a7a7777b29', //  _id созданного пользователя
  };

  next();
});

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

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
