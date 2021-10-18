//импортируем модель
const User = require('../models/user');

//Создание документов

//возвращает всех пользователей
const getUsers = (req, res) => {
  return User.find({})
    .then((users) => {
      return res.status(200).send({ data: users })
    })
    .catch((err) => {
      console.log('Error:' + err);
      return res.status(500).send({ message: 'Произошла ошибка' });
    })
}

//возвращает пользователя по _id
const getUserProfile = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId) // (req.params.userId)
    /*.orFail(() => new NotFoundError('Пользователь с указанным id не найден'))*/
    // либо вместо orFail
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      }
      return res.status(404).send({ message: 'Пользователь с указанным id не найден'});
    })
    .then((user) => {
      return res.status(200).send({ data: user })
    })
    .catch((err) => {
      console.log('Error:' + err);
      return res.status(500).send({ message: 'Произошла ошибка' });
  })
}

//создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body; // получим из объекта запроса имя, описание пользователя, аватар
  return User.create({ name, about, avatar }) // создадим документ на основе пришедших данных
    .then((user) => {
      return res.status(200).send({ data: user })
    })
    .catch((err) => {
      console.log('Error:' + err);
      return res.status(500).send({ message: 'Произошла ошибка' });
  })
}

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
      upsert: true // если пользователь не найден, он будет создан
    }
  )
    .then((user) => {
      return res.status(200).send({ data: user })
    })
    .catch((err) => {
      console.log('Error:' + err);
      return res.status(500).send({ message: 'Произошла ошибка' });
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
      upsert: true
    }
  )
    .then((user) => {
      return res.status(200).send({ çdata: user })
    })
    .catch((err) => {
      console.log('Error:' + err);
      return res.status(500).send({ message: 'Произошла ошибка' });
  })
}

module.exports = {
  getUsers,
  getUserProfile,
  createUser,
  updateUser,
  updateAvatar
};