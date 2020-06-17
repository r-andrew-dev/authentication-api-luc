const User = require('../models/user');
const {sendEmail} = require('../utils/index');
const keys = require("../../keys");


// @route POST api/auth/recover 
// @desc Recover Password - Generates token and sends password reset email 
// @access Public 

exports.recover = async (req, res) => {
    try {
        const {email} = req.body;

        const user = await User.findOne({email});

        if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any email. Please double check your email and try again.'});

        // Generate and set password reset token 

        user.generatePasswordReset();

        // save the updated user object 
        await user.save();

        // send email 

        console.log(user)

        let subject = 'Password change request';
        let to = user.email;
        let from = keys.keys.from_email;
        let link = 'http://' + req.headers.host + '/api/auth/reset/' + user.resetPasswordToken;
        let html = `<p>Hi ${user.firstName} ${user.lastName}</p>
                    <p>Please click on the following <a href="${link}">link</a> to reset your password.</p>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

        await sendEmail({ to, from, subject, html});

        res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

// @route POST api/auth/reset
// @desc Reset Password - Validate password reset token and shows the password reset view
// @access Public 

exports.reset = async(req, res) => {

    console.log("getting her to password.reset")
    try {
        const {token} = req.params; 

        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});

        if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired'});

        // Redirect user to form with the email address
        res.render('reset', {user});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});

        if (!user) return res.status(401).json({ message: 'Password reset token is invalid or has expired.'});

        // set the new password 
        user.password = req.body.password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.isVerified = true;

        // save the updated user object 

        await user.save();

        let subject = 'Your password has been changed';
        let to = user.email;
        let from = keys.keys.from_email;
        let html = `<p>Hi ${user.username}</p>
                    <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>`

        await sendEmail({ to, from, subject, html });

        res.status(200).json({ message: 'Your password has been updated.'});
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};