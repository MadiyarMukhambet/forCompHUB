// middleware/requireAuth.js
module.exports = (req, res, next) => {
  if (!res.locals.user) {
    return res.status(401).send('Доступ запрещен. Требуется авторизация');
  }
  req.user = res.locals.user; // Добавляем это присвоение
  next();
};

