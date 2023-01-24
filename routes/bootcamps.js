const express = require('express')
const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp, getBootcampsInRadius, bootcampPhotoUpload } = require('../controllers/bootcamps')

//middleware created to add queries to results
    //wrap this code around wherever you'd like it to be used
const advancedResults = require('../middleware/advancedResults')
const Bootcamp = require('../models/Bootcamp')

//INCLUDE OTHER RESOURCE ROUTES
const courseRouter = require('./courses')

// Initialize Router
const router = express.Router()

//Re-route into other resource routers - will pass onto correct router if it contains this
router.use('/:bootcampId/courses', courseRouter)

//------- ROUTES --------//

//don't need to use JSON.stringify b/c Express does not need that
//also don't need full path b/c it is defined in server.js by being mounted to the routes 

//chain the routes that have this root together

//route for bootcamps within a radius using zipcode and miles
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

//use advanceResults query methods for the Bootcamp model and 'courses' populate
router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(createBootcamp);

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;