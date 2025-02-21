// middleware/setUser.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    res.locals.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    // Если пользователь не найден, очищаем токен и устанавливаем null
    res.locals.user = user || null;
  } catch (err) {
    console.error('Ошибка при проверке токена:', err);
    res.clearCookie('token');
    res.locals.user = null;
  }
  next();
};
