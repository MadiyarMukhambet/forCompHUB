require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const requireAuth = require('./middleware/requireAuth');
const adminProductsRouter = require('./routes/adminProducts');
// Import product models
const Monitor = require('./models/Monitor');
const Mouse = require('./models/Mouse');
const Microphone = require('./models/Microphone');
const Headphone = require('./models/Headphone');
const Keyboard = require('./models/Keyboard');

// Import controllers for authentication and orders
const authController = require('./controllers/authController');
const orderController = require('./controllers/orderController');

// Import middleware for authentication (JWT protection)
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./middleware/authMiddleware');
const setUser = require('./middleware/setUser'); // Добавлено для установки res.locals.user

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(methodOverride('_method'));

// Глобальное использование middleware для установки res.locals.user
app.use(setUser);

// Connect to MongoDB
connectDB();

// Защищаем маршрут админ-панели middleware авторизации
app.use('/admin', authMiddleware, adminRoutes);
app.use('/admin', adminProductsRouter);
// Map product categories to their corresponding models
const categoryMap = {
  monitors: Monitor,
  mice: Mouse,
  microphones: Microphone,
  headphones: Headphone,
  keyboards: Keyboard
};

// ===================================================================
// Product Routes
// ===================================================================

// Universal route to display products by category
app.get('/products/:category', async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const Model = categoryMap[category];
    if (!Model) {
      return res.status(404).send('Category not found');
    }
    const products = await Model.find().lean().exec();
    res.render('products', {
      title: category.charAt(0).toUpperCase() + category.slice(1),
      products,
      category
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to display detailed product information
app.get('/products/:category/:id', async (req, res) => {
  try {
    const { category, id } = req.params;
    const Model = categoryMap[category.toLowerCase()];
    if (!Model) {
      return res.status(404).send('Category not found');
    }
    const product = await Model.findById(id).lean().exec();
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('productDetail', { title: product.name, product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Legacy routes redirection (for backward compatibility)
app.get('/monitors', (req, res) => res.redirect('/products/monitors'));
app.get('/mice', (req, res) => res.redirect('/products/mice'));
app.get('/microphones', (req, res) => res.redirect('/products/microphones'));
app.get('/headphones', (req, res) => res.redirect('/products/headphones'));
app.get('/keyboards', (req, res) => res.redirect('/products/keyboards'));

// ===================================================================
// Main Pages (EJS views)
// ===================================================================
// Используем authMiddleware, но он НЕ отправляет 401, если токена нет.
app.get('/', authMiddleware, (req, res) => { 
    res.render('index', { title: 'Home' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', errorMessage: null });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register', errorMessage: null });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});
app.use('/admin', requireAuth, adminRoutes);
// Защищаем маршруты заказов
app.post('/orders', requireAuth, orderController.placeOrder);
app.get('/orders', requireAuth, orderController.getOrders);

app.use('/auth', authRoutes);

// ===================================================================
// Authentication Routes
// ===================================================================

app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

// ===================================================================
// Order Routes (Protected with authMiddleware)
// ===================================================================

app.post('/orders', authMiddleware, orderController.placeOrder);
app.get('/orders', authMiddleware, orderController.getOrders);

// ===================================================================
// 404 Handler for Unknown Routes
// ===================================================================

app.use((req, res) => {
  res.status(404).send('Page not found');
});

// ===================================================================
// Start the Server
// ===================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
