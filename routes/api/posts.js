const PostController = require('../../controller/postController');
var express = require('express');
const auth = require('../../middleware/auth');
const Post = require('../../model/post');
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
router.get('/', auth, PostController.get_posts);

/*  @route     POST api/posts/myposts
    @desc      Get All post for a single user
    @access    Private
 */
router.get('/myposts', auth, PostController.my_posts);

/*  @route     POST api/posts/likes
    @desc     Like a post
    @access    Private
 */
router.put('/like', auth, PostController.like);

/*  @route     POST api/posts/unlikes
    @desc     Unlike a post
    @access    Private
 */
router.put('/unlike', auth, PostController.unlike);

module.exports = router;
