const express = require('express');
const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');
const Course = require('../models/Course');

const router = express.Router({ mergeParams: true }); //need merge params in this router r/t in case any routes were passed over here from the bootcamp router

// Middleware to use
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth'); //wrap around routes that require a token to use - ex specific user can upload a photo to a bootcamp or create a bootcamp.

//------- ROUTES --------//

//post request is forwarded from bootcamps router, get request for all bootcamps CAN be forwarded from bootcamps router

router
	.route('/')
	.get(
		advancedResults(Course, { path: 'bootcamp', select: 'name description' }),
		getCourses
	)
	.post(protect, authorize('publisher', 'admin'), addCourse);

router
	.route('/:id')
	.get(getCourse)
	.put(protect, authorize('publisher', 'admin'), updateCourse)
	.delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;
