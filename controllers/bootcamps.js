//create different methods that will be associatee with each route
//hold the logic here instead of in the routes

//middleware functions

// @desc        Get All Bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Show all bootcamps'})
}

// @desc        Get Single Bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `Show single bootcamp with id: ${req.params.id}`})
}

// @desc        Create new Bootcamp
// @route       POST /api/v1/bootcamps/
// @access      Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: 'Create a new bootcamp'})
}

// @desc        Update Bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `update bootcamp with id: ${req.params.id}`})
}

// @desc        Delete Bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({success: true, msg: `delete bootcamp with id: ${req.params.id}`})
}