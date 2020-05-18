const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const keys = require("../../keys");
const Schema = mongoose.Schema;

const Token = require('../models/token');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: 'Your email is required',
        trim: true
    },

    username: {
        type: String,
        unique: true,
        required: 'Your username is required',
    },

    password: {
        type: String,
        required: 'Your password is required',
        max: 100,
        min: 8
    },

    firstName: {
        type: String,
        required: 'First name is required',
        max: 100
    },

    lastName: {
        type: String,
        required: 'Last Name is required',
        max: 100
    },
    jobRole: {
        type: String,
        required: 'Job Title or Role is required',
        max: 100
    },
    bio: {
        type: String,
        required: false,
        max: 225
    },

    profileImage: {
        type: String,
        required: false,
        max: 225
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    resetPasswordToken: {
        type: String,
        required: false
    },

    resetPasswordExpires: {
        type: Date,
        required: false
    },
    ratings: [{

        skillName: {
            type: String,
            required: true
        },
        postedBy: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        Date: {
            type: Date,
            default: Date.now()
        },
        Category: {
            type: String,
        }
    }],
    ratingAverages: [{
        type: Number,
        default: true
    }]

}, {
    timestamps: true
});

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    let payload = {
        id: this._id,
        email: this.email,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
    };

    return jwt.sign(payload, keys.keys.jwt_secret, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

UserSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 360000;
    // expires in one hour 
};

UserSchema.methods.generateVerificationToken = function () {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };

    return new Token(payload);
};


module.exports = mongoose.model('Users', UserSchema);