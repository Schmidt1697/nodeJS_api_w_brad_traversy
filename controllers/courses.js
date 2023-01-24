const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc        Get All courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    //check if a bootcampId was sent in request
    //return only courses associated w/ this bootcamp if id is present
    if(req.params.bootcampId){
        const courses = await Course.find({ bootcamp: req.params.bootcampId})
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        //return all courses
        res.status(200).json(res.advancedResults)
    }

})

// @desc        Get single course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
   const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
   })
   //if course does not exist or incorrect id entered, show error
   if(!course) {
    return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
   }

    res.status(200).json({
        success: true,
        data: course
    })
})


// @desc        Add course to bootcamp
// @route       POST /api/v1/bootcamps/:bootcampId/courses
// @access      Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    //manually assign the bootcamp from the model w/ specified id so we can pass it in later when creating a course
    req.body.bootcamp = req.params.bootcampId;

    //get particlar bootcamp we want to add a course to
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    
    //check to see if bootcamp exists
    if(!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with the id of ${req.params.bootcampId}`), 404)
       }

    //create new course
    const course = await Course.create(req.body)
 
     res.status(200).json({
         success: true,
         data: course
     })
 })

 // @desc       Update course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    //get course by id to update
    let course = await Course.findById(req.params.id)
    
    //check to see if bootcamp exists
    if(!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.bootcampId}`), 404)
       }

    //update course with the req.body info
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

     res.status(200).json({
         success: true,
         data: course
     })
 })


 // @desc       Delete course
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    //get course by id to update
    const course = await Course.findById(req.params.id)
    
    //check to see if bootcamp exists
    if(!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.bootcampId}`), 404)
       }

    await course.remove();

     res.status(200).json({
         success: true,
         data: {}
     })
 })