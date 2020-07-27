const User = require('../model/user');
const Post = require('../model/post');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto');
// const { use } = require('../routes/api/users');
const bcrypt = require('bcrypt');


const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: 'api key here'
    }
}));


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
        if (!user) return res.status(400).json({ error: 'email or password is invalid' });
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
                return res.status(400).json({ error: "Email or Password is invalid" });
            } else {
                // success login ... Generating jwt for auth
                jwt.sign({ _id: user._id, email: user.email, name: user.name },
                    config.get('JWT_SECRET_KEY'),
                    {
                        expiresIn: 3600
                    }, (err, token) => {
                        if (err) throw err;
                        return res.json({
                            token,
                            user: {
                                _id: user._id,
                                email: user.email,
                                name: user.name,
                                pic: user.pic
                            },
                            following: user.following,
                            followers: user.followers,
                            message: "Sign in successfully"
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
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            error: 'Please all fields are required'
        });
    }
    if (name.length <= 3 || password.length <= 4) {
        return res.status(400).json({
            error: 'Please all fields muts be atleast more than 3 characters'
        });
    }
    User.findOne({ email: email }).then(user => {
        if (user) return res.status(400).json({ error: 'User already exist' });
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            pic: pic
        });

        User.newUser(newUser, (err, user) => {
            if (err) return err;
            return res.json({ message: "Account created successfully", user });
        });
    }).catch(err => {
        console.log(err);
    });
};


exports.view_other_users_profile = (req, res) => {
    User.findOne({ _id: req.params.id }).select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id }).populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({
                            error: err
                        });
                    }
                    return res.json({
                        user,
                        posts
                    });
                })

        }).catch(err => {
            return res.status(404).json({
                error: 'User not found'
            })
        })
}

/**
 * following
 * @param {*} req 
 * @param {*} res 
 */
exports.follow = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) return res.status(422).json({ error: err });
        //else
        User.findByIdAndUpdate(req.user._id, {
            $push: { following: req.body.followId }
        }, {
            new: true
        }).select("-password")
            .then(result => {
                return res.json({ result });
            }).catch(err => {
                return res.status(422).json({ error: err });
            })
    })
}

/**
 * unfollow a user
 * @param {*} req 
 * @param {*} res 
 */
exports.unFollow = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $push: { followers: req.user._id }
    }, {
        new: true
    }, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err })
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, {
            new: true
        }).select("-password")
            .then(result => {
                return res.json({
                    result
                });
            }).catch(err => {
                return res.status(422).json({ error: err })
            })
    })
}

/**
 * update pic
 * @param {*} req 
 * @param {*} res 
 */
exports.update_profile_pic = (req, res) => {
    User.findByIdAndUpdate(req.user._id, {
        $set: { pic: req.body.pic }
    }), {
        new: true
    }, (err, result) => {
        if (err) return res.status(422).json({ error: 'pic cant be post' })

        res.json({
            result
        })

    }
}

/**
 *Forgot password
 * @param {*} req 
 * @param {*} res 
 */
exports.user_reset_password = (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) throw err;
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({
                        error: 'No user is associated with this email'
                    });
                }
                user.resetToken = token;
                user.expiresToken = Date.now() + 360000;
                user.save().then(result => {
                    transporter.sendMail({
                        to: user.email,
                        from: 'no-reply@me.com',
                        subject: 'Password reset',
                        html: `<p>
                                  You request for password reset
                                  <h5>click this < href="http://localhost:3000/reset/${token}">link</a> to reset your password</h5>
                        </p>`
                    })
                    return res.json({
                        message: "Check your mail for link to reset your password"
                    });
                })
            })
            .catch(err => console.log(err));
    })
}

/**
 * Update user password
 * @param {*} req 
 * @param {*} res 
 */
exports.new_password = (req, res) => {
    const newPassword = req.body.password;
    const sentToken = req.body.token;
    User.findOne({ resetToken: sentToken, expiresToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({
                    error: "Try again. session ezpired"
                });
            }
            bcrypt.hash(newPassword, 10).then(hashPassword => {
                user.password = hashPassword;
                user.resetToken = undefined;
                user.expiresToken = undefined;
                user.save().then(saveUser => {
                    return res.json({
                        message: "Password changed successfully"
                    });
                })
            });
        }).catch(err => console.log(err));

}