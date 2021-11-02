const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken Для создания токенов

const JWT_SECRET = 'the-world-is-not-enought'; // secret key for token

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

const extractBearerToken = (header) => {
  header.replace('Bearer ', '');
};

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startWith('Bearer ')) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    return handleAuthError(res);
  }
  // если токен на месте, извлечём его
  // const token = authorization.replace('Bearer ', '');
  const token = extractBearerToken(authorization);
  let payload;
  try {
    // верифицируем токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // return res.status(401).send({ message: 'Необходима авторизация' });
    // return handleAuthError(err);
    const error = new Error('Необходима авторизация');
    error.statusCode = 403;

    next(err);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

// module.exports = { Authorized };
