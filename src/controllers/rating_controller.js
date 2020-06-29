const User = require('../models/user');
const ObjectId = require('mongodb').ObjectID;

exports.submitRating = async function(req, res) {
    try {
        const {id} = req.params 
        const {postedBy, rating, skillName} = req.body
        const rateSubmitted = await User.find({ "_id": ObjectId(id), "ratings": { $elemMatch: {"postedBy": postedBy, "skillName": skillName }}}, function(err, results) {

            if (err) {console.log(err)} 
        })

        if (rateSubmitted) {
        
        if (!postedBy || !rating || !skillName || !id) {
            {return res.send({message:"Please provide all required information to submit a rating."})}
       
        } else if (!rateSubmitted[0]) {
     
            User.updateOne({_id:id}, {$push: 
                {ratings: {
                    skillName: skillName,
                    postedBy: postedBy,
                    rating: rating
                }}
            },
                function(err, results) {
                if (err) {console.log(err)} 
                        else 
                         { return res.send({message: "Your rating was successfully added.", pass:true, results})}
                    })
         }else {
                return res.send({message: "You have already submitted a rating for this user for this skill.", pass:false})
            } 
        
        } else {
            console.log("ratesubmitted is undefined")
        }

    } catch (error) {
            console.log(error)
        }
    };

exports.getRatings = async function (req, res) {
    const {id}  = req.params
    await User.find({_id:id})
        .then((user) => {
            let ratings = user[0].ratings
            res.send(ratings)
            
        }).catch ((err) => {
            res.status(500).json({
                success: false,
                message: err.message
        })
    })
};

exports.getRatingAverages = async function(req, res) {
    const {id} = req.params
    await User.find({_id: id})
        .then((user) => {
            let ratings = user[0].ratings
            //  {skill:avg raiting}
            let data = []
           let ratObj ={}
           for (let i=0; i<ratings.length;i++){
               let skill = ratings[i].skillName
               if(ratObj[skill]){
                   let total = ratObj[skill].total + 1
                   let totRat = ratObj[skill].totRat + ratings[i].rating
                   let avgRat = totRat / total
                   ratObj[skill]={"total":total, "totRat":totRat,"avgRat":avgRat, "skill":skill}
               }
               else {
                ratObj[skill]={"total":1, "totRat":ratings[i].rating, "avgRat":ratings[i].rating, "skill":skill}
               }
           }
           //  FUNCTION TO GET ALL OF THE USERS RATINGS, SORT THEM BY SKILL NAME, 
// AND THEN AVERAGE TOGETHER THE SKILL NAME SETS.

            res.send(Object.values(ratObj))
        })
     .catch((err) => { 
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
 };






 

