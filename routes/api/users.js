const UserController = require('../../controller/userController');
var express = require('express');
const auth = require('../../middleware/auth');
var router = express.Router();

/*  @route     POST api/users/signin
    @desc      Sign In a user
    @access    Public
 */
router.post('/signin', UserController.sign_in);

/*  @route     POST api/users/signup
    @desc      sign Up a new user
    @access    Public
 */
router.post('/signup', UserController.sign_up);

/*  @route     GET api/users/:id
    @desc      View another user profiler
    @access    Private
 */
router.get('/:id', auth, UserController.view_other_users_profile);


/*  @route     PUT api/users/follow
    @desc      Follow a user
    @access    Private
 */

router.put('/follow', auth, UserController.follow)

/*  @route     PUT api/users/unfollow
    @desc      Unfollow a user
    @access    Private
 */
router.put('/unfollow', auth, UserController.unFollow)

/*  @route     PUT api/users/updatepic
    @desc      Update a user profile pics
    @access    Private
 */
router.put('/updatepic', auth, UserController.update_profile_pic)

/*  @route     POST api/users/reset-password
    @desc      Send a reset password link to a user password
    @access    Public
 */
router.post('/reset-password', UserController.user_reset_password)

/*  @route     POST api/users/new-password
    @desc      Update a user password
    @access    Private
 */
router.post('/new-password', UserController.new_password)


/*  @route     POST api/users/search-users
    @desc      Search for a user
    @access    Private
 */
router.post('/search-users', UserController.search_user)

module.exports = router;
