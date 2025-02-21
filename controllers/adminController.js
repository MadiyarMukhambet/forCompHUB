const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getUsersPage = async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin/users', { users });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getCreateUserPage = (req, res) => {
    res.render('admin/createUser');
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();
        res.redirect('/admin/users');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.getEditUserPage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('admin/editUser', { user });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, 
            { username, email, ...(hashedPassword && { password: hashedPassword }), role }, 
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.redirect('/admin/users');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users');
    } catch (err) {
        res.status(500).send(err.message);
    }
};