const ErrorResponse = require('../utils/errorResponse')

//doing our own error handling so we don't have to depend on 3rd party package

const errorHandler = (err, req, res, next) => {
    //make a copy of err object
    let error = {...err}
    error.message = err.message

    // Log to console for dev
    console.log('ERROR', err)

    //Mongoose bad ObjectId
    if(err.name === 'CastError'){
        const message = `Bootcamp not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404)
    }

    // Mongoose duplicate key error w/ code 11000

    if(err.code === 11000){
        const message = `Duplicate field value entered`;
        error = new ErrorResponse(message, 400)
    }

    // MOngoose Validation error
    if(err.name === 'ValidationError'){
        //could possibly be an array of validation errors
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }
    //good to check the error name that comes along when you receive an error - it's good to pay attention to these

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'server error'
    });
    
}

module.exports = errorHandler