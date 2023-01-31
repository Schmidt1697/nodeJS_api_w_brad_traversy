const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Pleaseadd a valid email']
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true, 'Please add a password'],
        minlength: 6,
        select: false 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }

})

//Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    //bcrypt salt (genSalt) takes in a certain number of rounds, more rounds = more secure, but too many is hard on system
    // 10 rounds is recommended
    const salt = await bcrypt.genSalt(10);
    //hash whatever password is sent with the salt
    this.password = await bcrypt.hash(this.password, salt);
})

// Sign JWT (web token) and return 
UserSchema.methods.getSignedJwtToken = function() {
    //takes in payload which is user_id
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Match user entered password to hashed password in database
// use bcrypt method - compare (returns a promise)
UserSchema.methods.matchPassword =  async function(enteredPassword){
    //convert entered password to a string
    let strEnteredPswd = enteredPassword.toString();
    return await bcrypt.compare(strEnteredPswd, this.password);
    
}


module.exports = mongoose.model('User', UserSchema)