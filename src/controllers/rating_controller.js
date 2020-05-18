const User = require('../models/user');

exports.submitRating = async function(req, res) {
    console.log(req.body)
    try {
        console.log('this route was hit')
        const {id} = req.params 
        const {postedBy, rating, skillName} = req.body
        const rateSubmitted = await User.find({"_id":id, "ratings.postedBy": postedBy, "ratings.skillName": skillName}, function(err, results) {
            if (err) {console.log(err)} 
            return
        } )
        
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
                         { return res.send({message: "your rating was successfully added.", results})}
                    })
         }else {
                return res.send({message: "You have already submitted a rating for this user for this skill."})
            } 
        
        }   catch (error) {
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

           console.log("->",ratObj)
           console.log(Object.values(ratObj))
            res.send(Object.values(ratObj))
            // res.status(200).json({ratings})
        })
     .catch((err) => { 
        res.status(500).json({
            success: false,
            message: err.message
        })
    })
 };


//  FUNCTION TO GET ALL OF THE USERS RATINGS, SORT THEM BY SKILL NAME, 
// AND THEN AVERAGE TOGETHER THE SKILL NAME SETS.



 

