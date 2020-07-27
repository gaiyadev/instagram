const Post = require('../model/post');

/**
 * Create post
 * @param {*} req 
 * @param {*} res 
 */
exports.create_post = (req, res) => {
    const { title, body, photo } = req.body;
    if (!title || !body || !photo) return res.status(400).json({ error: 'Please all fields are required' });

    req.user.password = undefined;
    const post = new Post({
        title: title,
        body: body,
        photo: photo,
        postedBy: req.user
    });

    Post.newPost(post, (err, post) => {
        if (err) return err;
        return res.json({ message: "Post created successfully", post });
    });
}

/**
 *Get post
 * @param {*} req
 * @param {*} res
 */
exports.get_posts = (req, res) => {
    Post.find().populate('postedBy', "_id name")
        .sort('-createdAt')
        .then(posts => {
            return res.json({ posts });
        }).catch(err => console.log(err))
}

/**
 * Get all post for a single user
 * @param {*} res 
 * @param {*} res 
 */
exports.my_posts = (req, res) => {
    Post.find({ postedBy: req.user._id }).populate('postedBy', "_id name").then(mypost => {
        return res.json({ mypost });
    }).catch(err => console.log(err));
}

/**
 * likes a post
 * @param {*} req 
 * @param {*} res 
 */
exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { likes: req.user._id },
    }, {
        new: true
    }).exec((err, result) => {
        if (err) return res.status(422).json({ error: err })
        return res.json({ result });
    })
}

/**
 * Unlike a post
 * @param {*} req 
 * @param {*} res 
 */

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: { likes: req.user._id },
    }, {
        new: true
    }).exec((err, result) => {
        if (err) return res.status(422).json({ error: err })
        return res.json({ result });
    })
}

/**
 * user making comment
 * @param {*} req 
 * @param {*} res 
 */
exports.comment = (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._d
    };
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment },
    }, {
        new: true
    }).populate("comments.postedBy", "_id, name")
        .populate("postedBy", "_id, name")
        .exec((err, result) => {
            if (err) return res.status(422).json({ error: err })
            return res.json({ result });
        })
}

/**
 * Delete a post
 * @param {*} req 
 * @param {*} res 
 */
exports.delete_post = (req, res) => {
    Post.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(422).json({
                    error: err
                });
            }
            if (post.postedBy._id.toString() === req.user._id.toString()) {
                post.remove().then(result => {
                    return res.json({
                        result,
                        message: 'Post deleted successfully'
                    });
                }).catch(err => console.log(err));
            }
        })
}


/**
 *Get a user post
 * @param {*} req
 * @param {*} res
 */
exports.get_a_user_posts = (req, res) => {
    //if postedBy in following
    Post.find({ postedBy: { $in: req.user.following } })
        .populate('postedBy', "_id name")
        .sort('-createdAt')
        .then(posts => {
            return res.json({ posts });
        })
        .catch(err => console.log(err))
}
