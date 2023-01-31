//separate from User just for auth specific code
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc        Register User
// @route       POST /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
	//destructure data from the request
	const { name, email, password, role } = req.body;

	// Create User - using mongoose which returns a promise
	// will do password hashing in middleware and not here in Controller
	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	// Create Token - using a method (not a static) so calling it on an instance of user (not the actual User Model)
	sendTokenResponse(user, 200, res);

	res.status(200).json({ success: true, token: token });
});

// @desc        Login User
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate email and password
	if (!email || !password) {
		return next(
			new ErrorResponse('Please provide an email and password.', 400)
		);
	}

	// Check user exists by searching the model
	const user = await User.findOne({ email: email }).select('+password');

	if (!user) {
		return next(new ErrorResponse('Invalid credentials', 401));
	}
	// Check if password entered by user at login mathces db password
	const isMatch = await user.matchPassword(password);

	if (!isMatch) {
		return next(new ErrorResponse('IsMatch not working', 401));
	}

	// Create Token - using a method (not a static) so calling it on an instance of user (not the actual User Model)
	sendTokenResponse(user, 200, res);
});

// Get TOKEN from model, crete cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
	//Create token
	const token = user.getSignedJwtToken();

	// Create cookie
	const options = {
		//make it expire 30 days from current time
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	//check if we are in production and set the secure property on our object to true (don't want this in development)
	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token,
	});
};

// @desc        Get current logged in user
// @route       GET /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
    //get the req.user from the protect middleware applied in the auth.js route
	const user = await User.findById(req.user.id);
	res.status(200).json({ success: true, data: user });
});
