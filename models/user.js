const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
// const validator = require('validator');
const isEmail = require('validator/lib/isEmail');

const url = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minLength: 2, // [2, 'Must be at least 2, got {VALUE}'], // минимальная длина имени — 2 символа
    maxLength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: url,
    validate: {
      validator: function validateAvatar(v) {
        const avatarUrl = /http(s)?:\/\/(www.)?[\w\-.]*\.\w{1,}\/?[\w\-._~:/?#[\]@!$&'()*+,;=]*#?/g; // /http(s)?:(\/){2}(w{3}\.)?.+\.ru.*(#)?/;
        return avatarUrl.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // чтобы API не возвращал хеш пароля
  },
});

// Код проверки почты и пароля является частью схемы User
userSchema.statics.findUserByCredentials = function authenticateUser(email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта и пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта и паролль'));
          }

          // console.log(user);

          // console.log(matched);
          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
