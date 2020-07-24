const mongoose = require('mongoose');
require('../database/db');
const { ObjectId } = mongoose.Schema.Types;

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: "no photo"
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },

    created_at: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;

//Saving
module.exports.newPost = (newPost, callback) => {
    newPost.save(callback)
}


