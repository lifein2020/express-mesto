const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserProfile);

//  создаёт пользователя
// router.post('/users', createUser);

// возвращает информацию о текущем пользователе
router.get('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
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
    avatar: Joi.string().required(),
  }),
}), updateAvatar); //  :userId

module.exports = router;
