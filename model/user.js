const mongoose = require('mongoose');
require('../database/db');
const bcrypt = require('bcrypt');
const { ObjectId } = mongoose.Schema.Types;
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sgTransport({
    auth: {
        api_key: 'api key here'
    }
}));

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 3,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 4,
        max: 540
    },
    resetToken: {
        type: String,
    },
    expiresToken: {
        type: Date
    },

    pic: {
        type: String,
        default: 'https://res.cloudinary.com/gaiyadev/image/upload/v1595657219/njwvi9bluhkgg2abgs5t.png'
    },
    followers: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],

    following: [
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    reg_date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

module.exports.newUser = (newUser, callback) => {
    bcrypt.hash(newUser.password, 10, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;  //set hash password
        newUser.save(callback); //create New User
        //send mail to users after sign up
        transporter.sendMail({
            to: newUser.email,
            from: "no-reply@me.com",
            subject: "Sign up success",
            html: "<h2>Welcome to instagram</h2>"

        }).then((res) => {
            console.log('mail send successfully')
        }).catch(err => console.log(err))
    });
}


// Compare Curent password and new password of user
module.exports.comparePassword = async (password, hash, callback) => {
    await bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        return callback(null, isMatch);
    });
}
