const User = require('../model/user');
const Joi = require('joi');

/*
 * *Sign in a new user
 * @param {*} req
 * @param {*} res
 */
exports.sign_in = (req, res) => {
    res.json('sign in')
};

/*
 * *Sign up a new user
 * @param {*} req 
 * @param {*} res 
 */
exports.sign_up = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            error: 'Please all fields are required'
        });
    }

    User.findOne({ email: email }).then(user => {
        if (user) return res.status(400).json({ message: 'User already exist' });
        const newUser = new User({
            name: name,
            email: email,
            password: password
        });

        User.newUser(newUser, (err, user) => {
            if (err) return err;
            return res.json({ message: "Account created successfully" });
        });
    }).catch(err => {
        console.log(err);
    });
};