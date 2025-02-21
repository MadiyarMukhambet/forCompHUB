const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        try {
            // Генерируем JWT токен
            const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            // Устанавливаем cookie
            res.cookie('token', token, { httpOnly: true }); 

            // Устанавливаем res.locals.user 
            res.locals.user = newUser;

            res.redirect('/');
        } catch (err) {
            console.error('Ошибка при генерации токена или установке cookie:', err);
            // Добавьте обработку ошибки, например, рендеринг страницы с ошибкой
            res.status(500).render('error', { error: 'Ошибка при регистрации. Пожалуйста, попробуйте позже.' });
        }

    } catch (err) {
        console.error('Registration error:', err);
        let errorMessage = 'Ошибка сервера';
        if (err.code === 11000) {
            errorMessage = 'Имя пользователя или Email уже заняты';
        }
        res.render('register', { title: 'Register', errorMessage: errorMessage });
    }
};

exports.login = async (req, res) => {
  try {
      const { username, password } = req.body;

      // 1. Находим пользователя по имени пользователя
      const user = await User.findOne({ username });
      if (!user) {
          return res.status(400).render('login', { errorMessage: 'Неверное имя пользователя или пароль.' });
      }

      // 2. Проверяем пароль
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).render('login', { errorMessage: 'Неверное имя пользователя или пароль.' });
      }

      // 3. Создаем JWT (полезная нагрузка, секретный ключ, опции)
      const token = jwt.sign(
          { userId: user._id, role: user.role }, // ВКЛЮЧАЕМ role!
          process.env.JWT_SECRET,
          { expiresIn: '1h' } //  Срок действия токена (например, 1 час)
      );

      // 4. Устанавливаем токен в куки
      res.cookie('token', token, {
          httpOnly: true, // Важно для безопасности: кука недоступна из JavaScript на клиенте
          secure: process.env.NODE_ENV === 'production', //  В production используйте secure: true (требуется HTTPS)
          maxAge: 3600000 // Время жизни куки в миллисекундах (должно совпадать с expiresIn токена)
      });

      // 5. Редирект на защищенную страницу (например, на главную)
      res.redirect('/'); // Или на другую страницу, куда вы хотите перенаправить пользователя

  } catch (err) {
      console.error(err);
      res.status(500).render('login', { errorMessage: 'Ошибка сервера при входе.' });
  }
};