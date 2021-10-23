//  импортируем модель
const User = require('../models/user');

//  Создание документов

//  возвращает всех пользователей
const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

//  возвращает пользователя по _id
const getUserProfile = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId) // (req.params.userId)
    .orFail(() => {
      const err = new Error('Ресурс не найден');
      err.statusCode = 404;
      throw err;
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

//  создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // из объекта запроса имя, описание пользователя, аватар
  return User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    .then((newUser) => {
      //  console.log('Пользователь создан');
      res.status(200).send({ data: newUser });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

// обновляет профиль
const updateUser = (req, res) => {
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
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

//  обновляет аватар
const updateAvatar = (req, res) => {
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
        return res.status(404).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserProfile,
  createUser,
  updateUser,
  updateAvatar,
};
