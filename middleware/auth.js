const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../model/user');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    //authorization === Bearer 665u56jykjmnytk
    if (!authorization) return res.status(401).json({ error: "You must be logged in" });
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, config.get('JWT_SECRET_KEY'), (err, payload) => {
        if (err) return res.status(401).json({ error: "You must be logged in!!" });
        const { _id } = payload;
        User.findById(_id).then(userId => {
            req.user = userId
            next();
        });
    });
}