const express = require('express')
const router = express.Router()
const { getBootcamps, getBootcamp, createBootcamp, updateBootcamp, deleteBootcamp } = require('../controllers/bootcamps')

//------- ROUTES --------//

//don't need to use JSON.stringify b/c Express does not need that
//also don't need full path b/c it is defined in server.js by being mounted to the routes 

//chain the routes that have this root together

router.route('/').get(getBootcamps).post(createBootcamp)

router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

module.exports = router;