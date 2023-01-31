const express = require('express');
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require('../controllers/bootcamps');
const Bootcamp = require('../models/Bootcamp');

//middleware created to add queries to results
//wrap this code around wherever you'd like it to be used
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth'); //wrap around routes that require a token to use - user must be logged in to use an routes that include protect
//use authorize AFTER protect middleware b/c we use the protect inside authorize

//INCLUDE OTHER RESOURCE ROUTES
const courseRouter = require('./courses');

// Initialize Router
const router = express.Router();

//Re-route into other resource routers - will pass onto correct router if it contains this
router.use('/:bootcampId/courses', courseRouter);

//------- ROUTES --------//

//don't need to use JSON.stringify b/c Express does not need that
//also don't need full path b/c it is defined in server.js by being mounted to the routes

//chain the routes that have this root together

//route for bootcamps within a radius using zipcode and miles
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
	.route('/:id/photo')
	.put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

//use advanceResults query methods for the Bootcamp model and 'courses' populate
router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
	.post(protect, authorize('publisher', 'admin'), createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
