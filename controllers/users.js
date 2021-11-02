// const validator = require('validator');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken Для создания токенов
const User = require('../models/user'); //  импортируем модель

const JWT_SECRET = 'the-world-is-not-enought';

//  Создание документов

//  возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch((err) => {
      // res.status(500).send({ message: 'Произошла ошибка' });
      next(err);
    });
};

//  возвращает пользователя по _id
const getUserProfile = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId) // (req.params.userId)
    .orFail(() => {
      const notFound = new Error('Ресурс не найден');
      notFound.statusCode = 404;
      throw notFound;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        /// return res.status(404).send({ message: err.message });
        // const notFound = new Error({ message: err.message });
        next(err);
      }
      if (err.name === 'CastError') {
        // return res.status(400).send({ message: 'Переданы некорректные данные' });
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      // return res.status(500).send({ message: 'Произошла ошибка' });
      next(err);
    });
};

//  создаёт пользователя
const createUser = (req, res, next) => {
  // const { email, password } = req.body;
  User.findOne(({ email: req.body.email }))
    .then((user) => {
      if (user) {
        // return res.status(409).send({ message: 'Пользователь с таким email уже существует' });
        const MongoServerError = new Error({ message: 'Пользователь с таким email уже существует' });
        MongoServerError.statusCode = 409;
        MongoServerError.code = 11000;
        MongoServerError.name = 'MongoServerError';
        throw MongoServerError;
      }
      return bcrypt.hash(req.body.password, 10); // хешируем пароль
    })
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then(({
      name,
      about,
      avatar,
      email,
      _id,
    }) => {
      //  console.log('Пользователь создан');
      res.status(201).send({
        data: {
          name,
          about,
          avatar,
          email,
          _id,
        },
      }); // .send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // return res.status(400).send({ message: 'Переданы некорректные данные' });
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        // const MongoServerError = new Error({ message: 'Пользователь с таким email уже существует' });
        // MongoServerError.statusCode = 409;
        // next(MongoServerError);
        next(err);
        // return res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      }
      // return res.status(500).send({ message: 'Произошла ошибка' });
      next(err);
    });
};

// обновляет профиль
const updateUser = (req, res, next) => {
  const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя
  return User.findByIdAndUpdate(
    //  req.params.userId,  //req.params.me
    req.user._id,
    { name, about },
    // Передаем объект опций чтобы передать в then  уже обновлённую запись:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      const err = new Error('Ресурс не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      /* вместо if (!user) {
        return res.status(404).send({ message: 'Ресурс не найден' });
      } */
      //  console.log('Данные пользователя обновлены');
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        // return res.status(404).send({ message: err.message });
        const notFound = new Error({ message: err.message });
        next(notFound);
      }
      if (err.name === 'ValidationError') {
        // return res.status(400).send({ message: 'Переданы некорректные данные' });
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      // return res.status(500).send({ message: 'Произошла ошибка' });
      next(err);
    });
};

//  обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      const err = new Error('Ресурс не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      /*  if (!user) {
        return res.status(404).send({ message: 'Ресурс не найден' });
      } */
      //  console.log('Аватар пользователя обновлен');
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        // return res.status(404).send({ message: err.message });
        const notFound = new Error({ message: err.message });
        next(notFound);
      }
      if (err.name === 'ValidationError') {
        // return res.status(400).send({ message: 'Переданы некорректные данные' });
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      // return res.status(500).send({ message: 'Произошла ошибка' });
      next(err);
    });
};

// аутентификация
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expresIn: '7d' }); // методу sign передали пейлоуд токена, секретный ключ подписи, объек опций - время действия токена

      // вернём токен
      res.send({ token }); // или заголовок Set-Cookie
    })
    .catch((err) => {
      // ошибка аутентификации
      if (err.statusCode === 401) {
        // return res.status(401).send({ message: 'Передан неверный логин или пароль' });
        const loginError = new Error('Передан неверный логин или пароль');
        next(loginError);
      }
      if (err.statusCode === 403) {
        // return res.status(403).send({ message: 'Такого пользователя не существует' });
        const notFoundUser = new Error('Такого пользователя не существует');
        next(notFoundUser);
      }
      // return res.status(500).send({ message: 'Произошла ошибка' });
      next(err);
    });
};

const getUserMe = (req, res, next) => {
  const { email, password } = req.body;
  // хеш пароля пользователя будет возвращаться из базы - select
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const notFoundUser = new Error('Такого пользователя не существует');
        notFoundUser.statusCode = 403;
        throw notFoundUser;
        // return res.status(403).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, user.password, (error, isValidPassword) => {
        if (!isValidPassword) {
          const authError = new Error('Почта или пароль не верные');
          authError.statusCode = 401;
          throw authError;
          // return res.status(401).send({ message: 'Почта или пароль не верные' });
        }
        return res.status(200).send({ data: user });
      });
    })
    .catch((err) => {
      if (err.statusCode === 403) {
        next(err); // notFoundUser
      }
      if (err.statusCode === 401) {
        next(err); // authError
      }
      if (err.statusCode === 404) {
        // return res.status(404).send({ message: err.message });
        const notFound = new Error({ message: err.message });
        next(notFound);
      }
      if (err.name === 'CastError') {
        // return res.status(400).send({ message: 'Переданы некорректные данные' });
        const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest);
      }
      // return res.status(500).send({ message: 'Произошла ошибка' });
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserProfile,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getUserMe,
};
