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
    @access    Public
 */
router.get('/:id', auth, UserController.view_other_users_profile);


module.exports = router;
