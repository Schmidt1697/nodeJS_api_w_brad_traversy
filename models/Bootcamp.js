const mongoose = require('mongoose')
// bring in 3rd party slugify to help create a slug for each 'name' entered 
const slugify  = require('slugify')
//bring in geocoder
const geocoder = require('../utils/geocoder')

//create schema

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    //basically a url- friendly version for the name 
    slug: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    website: {
        type: String,
        match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Please use a valid URL with HTTP or HTTPS']
    },
    phone: {
        type: String,
        maxlength: [20, 'Phone numver cannot be more than 20 characters']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Pleaseadd a valid email']
    },
    address:{
        type: String,
        required: [true, 'Please add an address'],
    },
    location:{
        //GeoJSON Point
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            // required: true
          },
          coordinates: {
            type: [Number],
            // required: true,
            index: '2dsphere'
          },
          formattedAddress: String,
          street: String,
          city: String,
          state: String,
          zipcode: String,
          country: String,
    },
    careers: {
        //Array of strings - show this with [] around the type of string
        type: [String],
        required: true,
        enum: [
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating cannot be greater than 10']
    },
    averageCost: Number,
    photo: {
        //only name of file in the database - will handle upload process elsewhere
        type: String,
        default: 'no-photo.jpg'
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGaurantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        defaut: Date.now
    }
}, {
    //adding Virtuals to do reverse Populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create bootcamp slug from schema name - want this to run BEFORE saving to db
        // not using an arrow function here b/c we need to use the this keyword
BootcampSchema.pre('save', function(next){
    //run through the slugify function that we get through the 3rd party package
    this.slug = slugify(this.name, {lower: true})
    //need to pass in next and call it so it will run the next piece of middleware afterwards 
    next();
})

//Geocode and create location field w/ the address input by user
BootcampSchema.pre('save', async function(next){
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode,
    }

    //do not save originally inputted address in DB - will use the inutted location info 
    this.address = undefined
    next();
})

//Cascade delete courses when a bootcamp is deleted
    //use a pre middleware  to access these fields BEFORE they are deleted
BootcampSchema.pre('remove', async function(next){
    console.log(`courses being removed from bootcamp ${this._id}`);
    //call deleteMany method on course model associated with the specific bootcamp by id 
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
})

// REVERSE POPULATE w/ VIRTUALS - BootcampSchema.virtual('field we want to add', { options - need to reference the model we will be using} )
BootcampSchema.virtual('courses',{
    ref: 'Course',
    localField: '_id',
    foreignField: 'bootcamp',
    justOne: false
} )

module.exports = mongoose.model('Bootcamp', BootcampSchema)