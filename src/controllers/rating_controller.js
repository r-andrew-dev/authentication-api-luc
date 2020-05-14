const User = require('../models/user');

exports.submitRating = async function(req, res) {
    try {
        const {id} = req.params 
        const {postedBy, rating, skillName} = req.body
        const rateSubmitted = await User.find({"_id":id, "ratings.postedBy": postedBy, "ratings.skillName": skillName}, function(err, results) {
            if (err) {console.log(err)} 
            return
        } )
        
        
        if (!rateSubmitted[0]) {
        
        User.updateOne({_id:id}, {$push: 
            {ratings: {
                skillName: skillName,
                postedBy: postedBy,
                rating: rating
            }}
        },
            function(err, results) {
            if (err) {console.log(err)} else 
                     { return res.send({message: "your rating was successfully added.", results})}
                })
            } else {
                return res.send({message: "You have already submitted a rating for this user for this skill."}) 
            } 
        
        }   catch (error) {
            console.log(error)
        }
    };


exports.getRatings = async function(req, res) {
    const {id} = req.params
    await User.find({_id: id})
        .then(function(ratings) {
            res.send(ratings[0].ratings)
            // res.status(200).json({ratings})
        })
     .catch(function(err) { 
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
 };


 

