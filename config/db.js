const mongoose = require('mongoose');

//create function to export and call in server.js
//when we use mongoose method, it will return a promise
//will get a connection - use async await so we do not use a bunch of .then()

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    await mongoose.set('strictQuery', true)

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)

}

//error handling for issues conencting to database are in server.js

module.exports = connectDB;