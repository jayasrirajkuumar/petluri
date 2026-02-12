const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    order: { type: Number, required: true },
    duration: { type: String, required: true } // e.g., "10:30"
});

const courseSchema = new mongoose.Schema({
    programCode: {
        type: String,
        unique: true,
        sparse: true
    },
    title: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: 1000
    },
    type: {
        type: String,
        required: true,
        enum: ['free', 'certification', 'professional', 'internship']
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    duration: {
        type: String,
        required: true // Total duration e.g., "40 hours"
    },
    price: {
        type: Number,
        default: 0
    },
    image: {
        type: String, // URL to course banner
        default: ''
    },
    modules: [{
        title: { type: String, required: true },
        description: { type: String, required: true }, // Added mandatory description
        content: [{
            type: { type: String, enum: ['video', 'quiz'], required: true },
            title: { type: String, required: true },
            url: { type: String }, // For video
            duration: { type: String }, // For video
            quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' } // For quiz
        }]
    }],
    videos: [videoSchema], // Deprecated but kept for backward compatibility
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }], // Deprecated but kept for backward compatibility
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
