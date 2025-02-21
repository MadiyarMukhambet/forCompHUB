// controllers/monitorController.js
const Monitor = require('../models/Monitor');

exports.getAll = async (req, res) => {
    try {
        const monitors = await Monitor.find().lean().exec();
        res.json(monitors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const monitor = await Monitor.findById(req.params.id).lean().exec();
        if (!monitor) return res.status(404).json({ message: 'Монитор не найден' });
        res.json(monitor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newMonitor = new Monitor(req.body);
        await newMonitor.save();
        res.status(201).json(newMonitor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedMonitor = await Monitor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMonitor) return res.status(404).json({ message: 'Монитор не найден' });
        res.json(updatedMonitor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deletedMonitor = await Monitor.findByIdAndDelete(req.params.id);
        if (!deletedMonitor) return res.status(404).json({ message: 'Монитор не найден' });
        res.json({ message: 'Монитор удален' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
