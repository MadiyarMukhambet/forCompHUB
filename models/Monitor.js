// models/Monitor.js
const mongoose = require('mongoose');

const MonitorSchema = new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    price: { type: Number },
    data_id: { type: Number },
    title: { type: String },
    specifications: {
        Общие_данные: {
            Тип_оборудования: { type: String },
            UID_товара: { type: String },
            Производитель: { type: String },
            Модель: { type: String }
        },
        Экран: {
            Тип_поверхности_экрана: { type: String },
            Тип_матрицы: { type: String },
            Диагональ_экрана: { type: String },
            Соотношение_сторон: { type: String },
            Максимальное_разрешение: { type: String },
            Частота: { type: String },
            Яркость: { type: String },
            Углы_обзора: { type: String },
            Мин_время_отклика: { type: String },
            Контрастность: { type: String },
            Динамическая_контрастность: { type: String }
        },
        Корпус: {
            Цвет: { type: String },
            Стандарт_крепления_VESA: { type: String },
            Углы_наклона: { type: String },
            Слот: { type: String }
        },
        Интерфейсы: {
            Интерфейс: { type: String },
            Кабели: { type: String }
        },
        Питание: {
            Потребляемая_мощность: { type: String },
            Потребляемая_мощность_режим: { type: String }
        },
        Размеры: {
            Размеры: { type: String },
            Упаковка: { type: String },
            Вес: { type: String },
            Вес_упаковки: { type: String }
        },
        Заводские: {
            Гарантия: { type: String },
            Ссылка: { type: String }
        }
    }
});

module.exports = mongoose.model('Monitor', MonitorSchema);
