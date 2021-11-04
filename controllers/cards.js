//  импртируем модель
const Card = require('../models/card');

//  возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
      // next(err);
    });
};

//  создаёт карточку
module.exports.createCard = (req, res) => {
  //  console.log(req.user._id);
  const ownerId = req.user._id;
  const { name, link } = req.body; // получим из объекта запроса имя и описание пользователя
  return Card.create({ name, link, owner: ownerId }) // создадим документ на основе пришедших данных
    .then((card) => {
      //  console.log('Карточка создана');
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
        /* const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest); */
      }
      return res.status(500).send({ message: 'Произошла ошибка', err: err.name });
      // next(err);
    });
};

//  удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    /*  .then((card) => {
      if (card) {
        console.log('Карточка удалена');
        return res.status(200).send({ card });
      }
      return res.status(404).send({ message: 'Ресурс не найден' });
    })  либо:  */
    .orFail(() => {
      const notFound = new Error('Ресурс не найден');
      notFound.statusCode = 404;
      throw notFound;
    })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
        /* const notFound = new Error({ message: err.message });
        next(err); */
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
        /* const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest); */
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
      // next(err);
    });
};

//  поставить лайк карточке
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  //  console.log('Set like to card. ', ' User id -> ', req.user._id, ' Card id -> ', cardId);
  return Card.findByIdAndUpdate(
    { _id: cardId }, //  req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    /*  .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Ресурс не найден' })
      }
      console.log('Лайк поставлен');
      return res.status(200).send({ card })
    })  */
    .orFail(() => {
      const notFound = new Error('Ресурс не найден');
      notFound.statusCode = 404;
      throw notFound;
    })
    .then((card) => {
      //  console.log('Лайк поставлен');
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
        // next(err);
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        /* const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest); */
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
      // next(err);
    });
};

//  убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  //  console.log('Delete like of card. ', ' User id -> ', req.user._id, ' Card id -> ', cardId);
  return Card.findByIdAndUpdate(
    cardId, //  req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    /*  .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Ресурс не найден' });
      }
      console.log('Лайк удален');
      return res.status(200).send({ card });
    })  */
    .orFail(() => {
      const notFound = new Error('Ресурс не найден');
      notFound.statusCode = 404;
      throw notFound;
    })
    .then((card) => {
      // console.log('Лайк удален');
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
        // next(err);
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
        /* const badRequest = new Error('Переданы некорректные данные');
        badRequest.statusCode = 400;
        next(badRequest); */
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
      // next(err);
    });
};
