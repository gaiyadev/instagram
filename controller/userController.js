const User = require('../model/user');

exports.sign_in = (req, res) => {
    res.json('sign in')
};

exports.sign_up = (req, res) => {
    const { name, email, password } = req.body;
    res.json({
        email,
        name, password
    })
};