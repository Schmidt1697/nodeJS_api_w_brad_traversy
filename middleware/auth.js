// middleware to use in our user authorization

const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;
	//check authorizaton headers exist and are formatted correctly
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		//get the token from the auth headers by turning into array and getting the second item
		token = req.headers.authorization.split(' ')[1];
	}
	// use cookies in production - uncomment this for production
	// else if(req.cookies.token){
	//     token = req.cookies.token
	// }

	// Make sure token exists
	if (!token) {
		return next(new ErrorResponse('Not authorized to access. No token', 401));
	}

	try {
		// Verify token w/ built in jwt method
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// decoded object will have id property w/ user Id, find the user by the decoded id
		//any route we use this middleware in will have access to the req.user
		req.user = await User.findById(decoded.id);
		next();
	} catch (error) {
		return next(new ErrorResponse('Not authorized to access', 401));
	}
});

//Grant Access to specific roles
//will take in multiple role values
exports.authorize = (...roles) => {
	//return our middleware function
	return (req, res, next) => {
		//check if currently logged in user's role
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					`User role ${req.user.role} is not authorized to access this route.`,
					403
				)
			);
		}
		next();
	};
};
