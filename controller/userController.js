const User = require('../model/user');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');


/*
 * *Sign in a new user
 * @param {*} req
 * @param {*} res
 */
exports.sign_in = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            error: 'Please all fields are required'
        });
    }

    User.findOne({ email: email }).then(user => {
        if (!user) return res.status(400).json({ error: 'email or password is incorrect' });
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
                return res.status(400).json({
                    error: "Email or Password is incorrect"
                });
            } else {
                // success login ... Generating jwt for auth
                jwt.sign({ _id: user._id, email: user.Email }, config.get('jwtPrivateKey'), {
                    expiresIn: 3600
                }, (err, token) => {
                    if (err) throw err;
                    return res.status(200).json({
                        token,
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email
                        },
                        mmessagesg: "Signin successfully"
                    });
                });
            }
        })
    });
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