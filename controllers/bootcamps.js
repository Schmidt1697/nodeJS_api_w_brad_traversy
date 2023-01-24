//Geocoder
const geocoder = require('../utils/geocoder')
//bring in bootcamp model to be able to call methods on
const Bootcamp = require('../models/Bootcamp')
//bring in async handler
const asyncHandler = require('../middleware/async')
//path module (core Node.js module)
const path = require('path')
//use this to send error messages from the controller
const ErrorResponse = require('../utils/errorResponse')

//create different methods that will be associatee with each route
//hold the logic here instead of in the routes

//middleware functions

// @desc        Get All Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    //have access to teh advancedResults middleware through adding it onto the Bootcamp.js route
    res.status(200).json(res.advancedResults)
})

// @desc        Get Single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        //get by the id that is in the request.params
        const bootcamp = await Bootcamp.findById(req.params.id);
        //if a correctly formmated id is entered but does not exist in the db - check and handle below
        if(!bootcamp){
           return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }

        res.status(200).json({ success: true, data: bootcamp})

}
)
// @desc        Create new Bootcamp
// @route       POST /api/v1/bootcamps/
// @access      Private
exports.createBootcamp = asyncHandler(async(req, res, next) => {
        //using the model to create new bootcamp
        const newBootcamp = await Bootcamp.create(req.body)
        res.status(201).json({
            success: true,
            data: newBootcamp
        })
})

// @desc        Update Bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            //want our data displayed to be the new/updated data
            new: true,
            runValidators: true
        });

        //if we cannot find a bootcamp with this id
        if(!bootcamp){
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }
        //if found and updated, send back success 
        console.log(bootcamp)
        res.status(200).json({
            success: true,
            data: bootcamp
        })
  
})
// @desc        Delete Bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
        //if we cannot find a bootcamp with this id
        if(!bootcamp){
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }

        //delete bootcamp found w/ id - this will trigger the middleweare to also remove courses associated w/ obotcamp in the Bootcamp Model
        bootcamp.remove();
        //if found and updated, send back success
        res.status(200).json({
            success: true,
            data: {}
        })
})

// @desc        Get bootcamps withing a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    //destructure zipcode and distance from the url params
   const { zipcode, distance } = req.params;

   //Get lat and long from geocoder
   const loc = await geocoder.geocode(zipcode);
   const lat = loc[0].latitude;
   const lng = loc[0].longitude;

   //calc radius using radians
   //divide distance by radius of earth (radius of earth = 3963 miles/ 6378 km)
   const radius = distance / 3963;
   
   //can see this in geocoder documentation
   const bootcamps = await Bootcamp.find({
    location:{ $geoWithin: { $centerSphere: [ [ lng, lat], radius] }}
   });

   res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
   })
})

// @desc        Upload photo for bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    //if we cannot find a bootcamp with this id
    if(!bootcamp){
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }

   //check to see if file was actually uploaded
   if(!req.files){
    return  next(new ErrorResponse(`Please upload a file`, 400))
   }

   const file = req.files.file;

   ///------- PHOTO VALIDATIONS-------///

    //make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return  next(new ErrorResponse(`Please upload an image file`, 400))
    }

    // check file size
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return  next(new ErrorResponse(`please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    // Create custom filename w/ original extension 
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

    // Upload file using the mv method
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if(err){
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        //actually add photo to the DB
        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name })

         //if bootcamp found and updated w/ photo, send back success
        res.status(200).json({
        success: true,
        data: file.name
    })
    })

   
})