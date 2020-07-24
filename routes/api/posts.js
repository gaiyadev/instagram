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

/*  @route     POST api/posts/myPosts
    @desc      Get All post for a single user
    @access    Private
 */
router.get('/mypost', auth, PostController.my_posts);



module.exports = router;
