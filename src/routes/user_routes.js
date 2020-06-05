const express = require('express');
const {check} = require('express-validator');
const multer = require('multer');

const User = require('../controllers/user_controller');
const validate = require('../middlewares/validate');

const router = express.Router();

const upload = multer().single('profileImage');

// INDEX 
router.get('/', User.index);

// STORE
router.post('/', [
    check('email').isEmail().withMessage('Enter a valid email address.'),
    check('username').not().isEmpty().withMessage('Your username is required'),
    check('firstName').not().isEmpty().withMessage('Your first name is required'),
    check('lastName').not().isEmpty().withMessage('Your last name is required')
], validate, User.store);

// SHOW 
router.get('/:id', User.show);

// UPDATE
router.put('/:id', upload, User.update);

// UPDATE PROFILE IMAGE 

router.put('/image/:id', upload, User.updateProfileImage)


// DELETE 
router.delete('/:id', User.destroy);

module.exports = router;