const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: [true, 'Please add a course title.']
    },
    description: {
        type: String,
        required: [true, 'Please add a description.']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks.']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost.']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill.'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    //each course is associated w/ a bootcamp - reference is the model 
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    }
})

//Static method to get average of course tuitions 
CourseSchema.statics.getAverageCost = async function(bootcampId) {
    
    //use method called aggregate that returns a promise, so need to use await
    //creating a pipeline
    //match the bootcamp field w/ whatever bootcamp is passed in
    // this creates an array with a single object inside that average tuitions value based on additional ones added
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition'}
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost/ 10) * 10
        })
    } catch (error) {
        console.error(error)
    }
    
    
}

// Call getAverageCost after save (middleware)
CourseSchema.post('save', function() {
    //need to use the model but we are already inside it 
    this.constructor.getAverageCost(this.bootcamp);
})
// Call getAverageCost before remove
CourseSchema.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model('Course', CourseSchema)