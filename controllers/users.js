//импортируем модель
const User = require('../models/user');

//Создание документов

//возвращает всех пользователей
const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send({ data: users });
    })
    .catch((err) => {
      console.log('Error:' + err);
      return res.status(500).send({ message: 'Произошла ошибка' });
    })
};

//возвращает пользователя по _id
const getUserProfile = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId) // (req.params.userId)
    .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
    // либо вместо orFail
    /*.then((user) => {
      if (user) {
        console.log('Пользователь найден');
        return res.status(200).send(user);
      }
      return res.status(404).send({ message: 'Пользователь с указанным id не найден', err: err.name });
    })*/
    .then((user) => {
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'CastError') {
        console.log('Error: ' + err);
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные', err: err.name });
      } else {
        console.log('Error: ' + err);
        return res.status(500).send({ message: 'Произошла ошибка', err: err.name });
      }
   })
};


//создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя, описание пользователя, аватар
  return User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    .then((user) => {
      console.log('Пользователь создан');
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        console.log('Error: ' + err);
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные', err: err.name });
      } else {
        console.log('Error: ' + err);
        return res.status(500).send({ message: 'Произошла ошибка', err: err.name });
      }
    })
};

// обновляет профиль
const updateUser = (req, res) => {
  const { name, about } = req.body; // получим из объекта запроса имя и описание пользователя
  return User.findByIdAndUpdate(
    //req.params.userId,  //req.params.me
    req.user._id,
    { name, about },
    // Передаем объект опций чтобы передать в then  уже обновлённую запись:
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }
  )
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Переданные данные отсутствуют' });
    }
    console.log('Данные пользователя обновлены');
    return res.status(200).send({ data: user });
  })
  .catch((err) => {
    const ERROR_CODE = 400;
    if (err.name === 'ValidationError') {
      console.log('Error: ' + err);
      return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные', err: err.name });
    } else {
      console.log('Error: ' + err);
      return res.status(500).send({ message: 'Произошла ошибка', err: err.name });
    }
  })
};

//обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    //req.params.userId, //req.params.me
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
  .then((user) => {
    if (!user) {
      return res.status(404).send({ message: 'Переданные данные отсутствуют' });
    }
    console.log('Аватар пользователя обновлен')
    return res.status(200).send({ çdata: user });
  })
  .catch((err) => {
    const ERROR_CODE = 400;
    if (err.name === 'ValidationError') {
      console.log('Error: ' + err);
      return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные', err: err.name });
    } else {
      console.log('Error: ' + err);
      return res.status(500).send({ message: 'Произошла ошибка', err: err.name });
    }
  })
};

module.exports = {
  getUsers,
  getUserProfile,
  createUser,
  updateUser,
  updateAvatar
};