// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        // Если токена нет, ПРОСТО вызываем next() БЕЗ редиректов и ошибок.
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            res.clearCookie('token');
            // Здесь МОЖНО отправить 401, т.к. токен есть, но он невалидный.
            return res.status(401).send('Доступ запрещен. Неверный токен');
        }

        req.user = user;
        res.locals.user = user; // Устанавливаем res.locals.user
        next();

    } catch (err) {
        console.error('Ошибка при проверке токена:', err);
        res.clearCookie('token');
        return res.status(401).send('Доступ запрещен. Неверный токен');
    }
};