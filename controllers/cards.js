//импртируем модель
const Card = require('../models/card');

//возвращает все карточки
module.exports.getCards = (req, res) => {
  return Card.find({})
  .then((cards) => {
    return res.status(200).send({ data: cards })
  })
  .catch((err) => {
    console.log('Error:' + err);
    return res.status(500).send({ message: 'Произошла ошибка' });
  });
};

//создаёт карточку
module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const ownerId = req.user._id;
  const { name, link } = req.body;                                 // получим из объекта запроса имя и описание пользователя
  return Card.create({ name, link, owner: ownerId })                                          // создадим документ на основе пришедших данных
  .then((card) => {
    console.log('Карточка создана');
    return res.status(200).send({ data: card });
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
  });
};


//удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
  .then((card) => {
    if (card) {
      console.log('Карточка удалена');
      return res.status(200).send({ card });
    }
    return res.status(404).send({ message: 'Карточка с указанным id не найдена'});
  })
  .then ((card) => {
    return res.status(200).send({card})
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

//поставить лайк карточке
module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  console.log('Set like to card. ' + ' User id -> ' + req.user._id + ' Card id -> ' + cardId);
  return Card.findByIdAndUpdate(
    { _id: cardId },//req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
  /*.then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Переданные данные отсутствуют' });
    }
    console.log('Лайк поставлен');
    return res.status(200).send({ card })
  })*/
  .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
  .then((card) => {
    console.log('Лайк поставлен');
    return res.status(200).send({ card })
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

//убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  console.log('Delete like of card. ' + ' User id -> ' + req.user._id + ' Card id -> ' + cardId);
  return Card.findByIdAndUpdate(
    cardId, //req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  /*.then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    }
    console.log('Лайк удален');
    return res.status(200).send({ card });
  })*/
  .orFail(() => new NotFoundError('Карточка с указанным id не найдена'))
  .then((card) => {
    console.log('Лайк удален');
    return res.status(200).send({ card })
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