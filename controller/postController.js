const Post = require('../model/post');

/**
 * Create post
 * @param {*} req 
 * @param {*} res 
 */
exports.create_post = (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) return res.status(400).json({ error: 'Please all fields are required' });

    req.user.password = undefined;
    const post = new Post({
        title: title,
        body: body,
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

}