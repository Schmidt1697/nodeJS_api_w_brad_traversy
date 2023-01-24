//this file is connecting our creating and deleting bootcamp methods w/ the data from the _data file (list of bootcamps) and seeding data for our app with that list 
//bring in this fs module which is already included in Node.js
const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//Load env vars
dotenv.config({ path: './config/config.env'})

//Load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))

//Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)

        console.log('Data imported...'.green.inverse)
        process.exit();
        
    } catch (err) {
        console.error(err)
    }
}

//Delete Data

const deleteData = async () => {
    try {
        //w/ deleteMany, if you don't pass anyting in, will delete everything 
        await Bootcamp.deleteMany()
        await Course.deleteMany()

        console.log('Data deleted...'.red.inverse)
        process.exit();
        
    } catch (err) {
        console.error(err)
    }
}

//have argv array on the process object that will show arguments passed in
//can easily create (-i) or delete (-d) by running node seeder -i or node seeder -d 
if(process.argv[2] === '-i'){
    importData();
}else if (process.argv[2] === '-d'){
    deleteData();
}