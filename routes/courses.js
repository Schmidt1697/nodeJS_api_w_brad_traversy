const express = require('express')
const { getCourses, getCourse, addCourse, updateCourse, deleteCourse } = require('../controllers/courses')

//bring in Course Model and advancedResults middleware
const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')


const router = express.Router({ mergeParams: true }) //need merge params in this router r/t in case any routes were passed over here from the bootcamp router

//------- ROUTES --------//

//post request is forwarded from bootcamps router, get request for all bootcamps CAN be forwarded from bootcamps router

router.route('/')
    .get(advancedResults(Course, { path: 'bootcamp', select: 'name description'}),getCourses).post(addCourse);

router.route('/:id')
    .get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router;