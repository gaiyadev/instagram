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

router.get('/protected', auth, (req, res) => {
  res.send('hello user');
})

module.exports = router;
