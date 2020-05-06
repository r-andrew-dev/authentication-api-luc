const cloudinary = require('cloudinary').v2
const keys = require("../../keys");

cloudinary.config({
    cloud_name: keys.keys.cloud_name, 
    api_key: keys.keys.cloud_api_key,
    api_secret: keys.keys.cloud_api_secret
})

module.exports = cloudinary;