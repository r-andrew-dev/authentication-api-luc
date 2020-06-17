const express = require('express');
const {check} = require('express-validator')


const Auth = require('../controllers/auth_controller');
const Password = require('../controllers/password_controller');
const User = require('../controllers/user_controller')
const validate = require('../middlewares/validate');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: "You are in the auth endpoint. Register or Login to test authentication."});

});

router.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email address.'),
    check('password').not().isEmpty().isLength({min: 8}).withMessage('Must be at least 8 characters long'),
    check('firstName').not().isEmpty().withMessage('Your first name is required.'),
    check('lastName').not().isEmpty().withMessage('Your last name is required.'),

], validate, Auth.register);

router.post('/register/employee', [
    check('email').isEmail().withMessage('Enter a valid email address.'),
    check('firstName').not().isEmpty().withMessage('Employee first name is required.'),
    check('lastName').not().isEmpty().withMessage('Employee last name is required.'),
    check('jobRole').not().isEmpty().withMessage('Please select a job role from the drop down.'),

], validate, User.store)

router.post("/login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty(),
], validate, Auth.login);


// EMAIL VERIFICATION
router.get('/verify/:token', Auth.verify);
router.post('/resend', Auth.resendToken);

// PASSWORD RESET
router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, Password.recover);

router.get('/reset/:token', Password.reset);

router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({min: 8}).withMessage('Must be at least eight characters'),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
], validate, Password.resetPassword);

module.exports = router;