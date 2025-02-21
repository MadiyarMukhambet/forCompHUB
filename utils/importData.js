// utils/importData.js
const axios = require('axios');
const Monitor = require('../models/Monitor');

exports.importMonitorData = async (req, res) => {
    try {
        // Пример: получение данных с внешнего API (замените URL на реальный)
        const externalApiUrl = 'https://api.example.com/products';
        const response = await axios.get(externalApiUrl);
        const data = response.data;
        
        for (let item of data) {
            const newMonitor = new Monitor(item);
            await newMonitor.save();
        }
        res.json({ message: 'Данные успешно импортированы' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
