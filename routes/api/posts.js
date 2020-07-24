const PostController = require('../../controller/postController');
var express = require('express');
const auth = require('../../middleware/auth');
var router = express.Router();

/*  @route     POST api/posts/
    @desc      Create  a new post
    @access    Private
 */
router.post('/', auth, PostController.create_post);

/*  @route     POST api/posts/
    @desc      Get All post
    @access    Private
 */
router.get('/', PostController.get_posts);


module.exports = router;
