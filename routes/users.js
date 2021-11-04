const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const validator = require('validator');
// валидация ссылок на аватар
const method = (value) => {
  let result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('URL validation err');
};

const {
  getUsers,
  getUserProfile,
  // createUser,
  updateUser,
  updateAvatar,
  getUserMe,
} = require('../controllers/users');

//  возвращает всех пользователей
router.get('/users', getUsers);

//  router.get('/users', () => {console.log('Сделано!')})

//  возвращает пользователя по _id
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserProfile);

//  создаёт пользователя
// router.post('/users', createUser);

// возвращает информацию о текущем пользователе
router.get('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
}), getUserMe);

// обновляет профиль
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser); //   :userId

//  обновляет аватар
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(method),
  }),
}), updateAvatar); //  :userId

module.exports = router;
