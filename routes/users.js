const router = require('express').Router();

const {
  getUsers,
  getUserProfile,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users.js');

//  возвращает всех пользователей
router.get('/users', getUsers);

//  router.get('/users', () => {console.log('Сделано!')})

//  возвращает пользователя по _id
router.get('/users/:userId', getUserProfile);

//  создаёт пользователя
router.post('/users', createUser);

// обновляет профиль
router.patch('/users/me', updateUser); //   :userId

//  обновляет аватар
router.patch('/users/me/avatar', updateAvatar); //  :userId

module.exports = router;
