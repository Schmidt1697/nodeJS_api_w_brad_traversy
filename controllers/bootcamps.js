//bring in bootcamp model to be able to call methods on
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')

//create different methods that will be associatee with each route
//hold the logic here instead of in the routes

//middleware functions

// @desc        Get All Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps})
    } catch (error) {
        res.status(400).json({ success: false })
        // next(error)
    }
}

// @desc        Get Single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = async (req, res, next) => {
    try {
        //get by the id that is in the request.params
        const bootcamp = await Bootcamp.findById(req.params.id);
        //if a correctly formmated id is entered but does not exist in the db - check and handle below
        if(!bootcamp){
           return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        }

        res.status(200).json({ success: true, data: bootcamp})

    } catch (error) {
        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
    }
}

// @desc        Create new Bootcamp
// @route       POST /api/v1/bootcamps/
// @access      Private
exports.createBootcamp = async(req, res, next) => {
    try {
        //using the model to create new bootcamp
        const newBootcamp = await Bootcamp.create(req.body)
        res.status(201).json({
            success: true,
            data: newBootcamp
        })
    } catch (error) {
        res.status(400).json({success: false})
    }
   
}

// @desc        Update Bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            //want our data displayed to be the new/updated data
            new: true,
            runValidators: true
        });

        //if we cannot find a bootcamp with this id
        if(!bootcamp){
            return res.status(404).json({ success: false, msg: 'Not found' })
        }
        //if found and updated, send back success 
        console.log(bootcamp)
        res.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch (error) {
        res.status(400).json({success: false})
    }
}

// @desc        Delete Bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        //if we cannot find a bootcamp with this id
        if(!bootcamp){
            return res.status(404).json({ success: false, msg: 'Not found' })
        }
        //if found and updated, send back success
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        res.status(400).json({success: false})
    }
}