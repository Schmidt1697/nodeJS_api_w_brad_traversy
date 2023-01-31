const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')

//Load env varibles
dotenv.config({ path: './config/config.env'});

//Connect to DB
connectDB();

//Route Files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth')
const { connect } = require('mongoose');

const app = express();

// Body parser - need to use middleware
app.use(express.json());

// Cookie parser
app.use(cookieParser());

//Dev logging middleware - this logs the response type and url
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// File Upload
app.use(fileupload())

// Set static folder for file upload
app.use(express.static(path.join(__dirname, 'public')))

//Mount Routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)

//Use custom error Handler created as a piece of middleware
app.use(errorHandler)

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

// Handle unhandled rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold)
    //close server and exit process
    //takes in a callback and pass in 1 to show 'exit with failure'
    server.close(() => process.exit(1))
})