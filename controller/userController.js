const User = require('../model/user');
const Post = require('../model/post');
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