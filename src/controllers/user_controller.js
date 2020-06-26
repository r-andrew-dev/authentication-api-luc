const User = require('../models/user');
const { uploader, sendEmail } = require('../utils/index');
const keys = require("../../keys");

// @route GET admin/user 
// @desc returns all users 
// @access Public 

exports.index = async function(req, res) {

    const users = await User.find().sort({firstName: 1});
    res.status(200).json({users});
};

exports.getEmployees = async function(req, res) {
    
    const {company} = req.params

    const users = await User.aggregate([{$match: {"company": company, "employer": false, "isVerified" : true}}]).sort({firstName: 1});
    res.status(200).json(users);
};

// @route POST api/user 
// @desc Add a new user 
// @access Public 

exports.store = async (req, res) => {


    try {

        const {email} = req.body

        // Make sure this account doesn't already exist 
        const user = await User.findOne({email});

        if (user) return res.status(401).json({message: 'The email address you have entered is already associated with another account. You can change this users role instead.'});

        const password = '_' + Math.random().toString(36).substr(2, 9); 
        // generate a random password 
        const newUser = new User({...req.body, password});

        const user_ = await newUser.save();

        // Generate and set password reset token 
        user_.generatePasswordReset();

        // Save the updated user Object 
        await user_.save();

        console.log(user_)

        // get mail options 
        let subject = 'New Account Created';
        let to = user_.email; 
        let from = keys.keys.from_email;
        let link = 'http://' + req.headers.host + '/api/auth/reset/' + user_.resetPasswordToken;
        let html = `<p>Hi ${user_.firstName} ${user_.lastName}<p><br><p>A new account has been created for you on Level Up Coding - a developer rating application. Please click on 
                    the following <a href="${link}">link</a> to set your password and login.</p>
                    <br><p>If you or your employer did not request this, please ignore this email.</p>
                    <p>FOR OUR TESTING PURPOSES PLEASE MAKE YOUR PASSWORD Bootcamp1<p>`

        await sendEmail({ to, from, subject, html, link});

        res.status(200).json({message: 'An email has been sent to ' + user_.email + '.'});

    }catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

// @route GET Api/user/{id}
// @desc Returns a specific user 
// @access Public 

exports.show = async function(req, res) {
    try { 
        const id = req.params.id;

        let user = await User.findById(id);

        if (!user) return res.status(401).json({ message: 'User does not exist!'});

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @route PUT api/user/{id}
// @desc Update user details 
// @access Public 

exports.update = async function(req, res) {
    try {
        const update = req.body;
        const id = req.params.id;
        const userId = req.user._id;

        // Make sure the passed id is that of the logged in user
        if (userId.toString() != id.toString()) return res.status(401).json({ message: 'Sorry. You do not have permission to update this data.'});

        let user = await User.findByIdAndUpdate(id, {$set: update}, {new: true});

        // if there is no image, return success message

        if (!req.file) return res.status(200).json({ user, message: 'User has been updated.'});

        // attempt to upload to Cloudinary 

        const result = await uploader(req);
        const user_ = await User.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});

        if (!req.file) return res.status(200).json({user: user_, message: 'User has been updated.'});
    
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateProfileImage = async function (req, res) {

    try {
        console.log('hitting this route - to upload an image')
      
        const id = req.params.id 
        const userId = req.user._id;
        const image = req.body.data

                // Make sure the passed id is that of the logged in user
                if (userId.toString() != id.toString()) {
                    console.log("hit here Id's dont' match")
                    return res.status(401).json({ message: 'Sorry. You do not have permission to update this data.'});
                }
        
                // if (!req.file) {
                //     console.log("Hit here, saying no file present")
                //     return res.status(200).json({ user, message: 'User has been updated.'});
                // }
        
                // attempt to upload to Cloudinary 
        
                // const result = await uploader(req);
                const user_ = await User.findByIdAndUpdate(id, {$set: {profileImage: image}}, {new: true});
                console.log("file detected and users match")
        
                if (!req.file) return res.status(200).json({user: user_, message: 'User has been updated.'});
            
            } catch (error) {
                res.status(500).json({message: error.message});
            }
        };


// @route DESTROY api/user/{id}
// @desc Delete user 
// @access Public

exports.destroy = async function (req, res) {
    try { 
        const id = req.parms.id
        const user_id = req.user._id;

        // Make sure the passed id is that of the logged in user

        if (user_id.toString() !== id.toString()) return res.status(401).json({message: "Sorry, you don't have the permission to delete this data."});

        await User.findByIdAndDelete(id);
        res.status(200).json({message: 'User has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};