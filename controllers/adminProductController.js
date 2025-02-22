const Monitor = require('../models/Monitor');
const Mouse = require('../models/Mouse');
const Microphone = require('../models/Microphone');
const Headphone = require('../models/Headphone');
const Keyboard = require('../models/Keyboard');

// Карта категорий для определения используемой модели
const categoryMap = {
  monitors: Monitor,
  mice: Mouse,
  microphones: Microphone,
  headphones: Headphone,
  keyboards: Keyboard,
};
// Задаём стандартные технические характеристики по умолчанию
const defaultSpecifications = {
    "Технические характеристики": {
      "UID товара": "",
      "Производитель": "",
      "Модель": "",
      "Тип": "",
      "Размеры": "",
      "Вес": ""
      // Можно добавить другие ключи по необходимости
    }
  };
function getModel(category) {
  return categoryMap[category.toLowerCase()];
}

exports.getProducts = async (req, res) => {
  const category = req.query.category;
  if (!category) {
    return res.status(400).send('Category is required as query parameter');
  }
  const Model = getModel(category);
  if (!Model) {
    return res.status(400).send('Invalid category');
  }
  try {
    const products = await Model.find();
    res.render('admin/products', { products, category });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getCreateProductPage = (req, res) => {
  const category = req.query.category;
  if (!category) {
    return res.status(400).send('Category is required as query parameter');
  }
  res.render('admin/createProduct', { category });
};

exports.createProduct = async (req, res) => {
    const category = req.query.category;
    if (!category) {
      return res.status(400).send('Category is required as query parameter');
    }
    const Model = getModel(category);
    if (!Model) {
      return res.status(400).send('Invalid category');
    }
    try {
      const productData = {
        name: req.body.name,
        url: req.body.url || "",             // URL товара (необязательное)
        price: req.body.price,
        data_id: req.body.data_id,
        image: req.body.image,               // URL картинки, должно быть заполнено
        // Если спецификации переданы и не пусты, парсим JSON, иначе ставим дефолтные
        specifications: req.body.specifications && req.body.specifications.trim().length > 0 
                          ? JSON.parse(req.body.specifications) 
                          : defaultSpecifications
      };
      // Добавляем категорию, если требуется
      productData.category = category;
      const newProduct = new Model(productData);
      await newProduct.save();
      res.redirect(`/admin/products?category=${category}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  };
  
exports.getEditProductPage = async (req, res) => {
  const category = req.query.category;
  if (!category) {
    return res.status(400).send('Category is required as query parameter');
  }
  const Model = getModel(category);
  if (!Model) {
    return res.status(400).send('Invalid category');
  }
  try {
    const product = await Model.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('admin/editProduct', { product, category });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateProduct = async (req, res) => {
    const category = req.query.category;
    if (!category) {
      return res.status(400).send('Category is required as query parameter');
    }
    const Model = getModel(category);
    if (!Model) {
      return res.status(400).send('Invalid category');
    }
    try {
      // Собираем данные для обновления
      const productData = {
        name: req.body.name,
        url: req.body.url || "",             // URL товара (может быть пустым)
        price: req.body.price,
        data_id: req.body.data_id,
        image: req.body.image,               // URL картинки
      };
      // Если админ ввёл спецификации (т.е. поле не пустое), обновляем его, иначе оставляем прежним
      if (req.body.specifications && req.body.specifications.trim().length > 0) {
        productData.specifications = JSON.parse(req.body.specifications);
      }
      const updatedProduct = await Model.findByIdAndUpdate(req.params.id, productData, { new: true });
      if (!updatedProduct) {
        return res.status(404).send('Product not found');
      }
      res.redirect(`/admin/products?category=${category}`);
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

exports.deleteProduct = async (req, res) => {
  const category = req.query.category;
  if (!category) {
    return res.status(400).send('Category is required as query parameter');
  }
  const Model = getModel(category);
  if (!Model) {
    return res.status(400).send('Invalid category');
  }
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.redirect(`/admin/products?category=${category}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
