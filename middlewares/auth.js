const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken Для создания токенов

const JWT_SECRET = 'the-world-is-not-enought'; // secret key for token

const handleAuthError = () => {
  const loginError = new Error('Необходима авторизация');
  loginError.statusCode = 401;
  throw loginError;
};

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  // если токен на месте, извлечём его
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(err);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
