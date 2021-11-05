const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken Для создания токенов

const JWT_SECRET = 'the-world-is-not-enought'; // secret key for token

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
  /* const loginError = new Error('Передан неверный логин или пароль');
  loginError.statusCode = 401;
  throw (loginError); */
};

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    // console.log(authorization);
    return handleAuthError(res);
  }
  // если токен на месте, извлечём его
  // console.log(authorization);
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
    // return handleAuthError(err);

    /* const error = new Error('Необходима авторизация');
    error.statusCode = 403;

    next(err); */
  }
  // console.log(token);
  // console.log(payload);

  req.user = payload; // записываем пейлоуд в объект запроса
  // console.log(req.user);

  next(); // пропускаем запрос дальше
};
