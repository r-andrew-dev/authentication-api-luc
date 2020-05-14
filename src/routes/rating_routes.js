const express = require('express');
const Rating = require('../controllers/rating_controller');
const router = express.Router();


// INDEX 
// router.get('/', (req, res) => {
//     res.status(200).json({message: "You are in the rating endpoint. Register or Login post and see ratings."});

// })
router.get('/user/:id', Rating.getRatings)

router.get('/user/averages/:id', Rating.getRatingAverages);

router.post('/user/:id', Rating.submitRating);

// router.get('/user/averages/:id', Rating.getAverages);

module.exports = router;