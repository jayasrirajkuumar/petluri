const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of 4 options
    correctAnswer: { type: String, required: true }, // The correct option string or index
    points: { type: Number, default: 1 }
});

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false // Optional, can be linked later
    },
    questions: [questionSchema],
    passingScore: {
        type: Number,
        required: true,
        default: 70 // Percentage
    },
    timeLimit: {
        type: Number, // in minutes
        required: true,
        default: 30
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
