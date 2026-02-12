const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    progress: {
        completedVideos: [{ type: String }], // Store video IDs or URLs unique to video
        quizAttempts: [{
            quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
            score: Number,
            passed: Boolean,
            attemptedAt: { type: Date, default: Date.now }
        }]
    },
    completionPercentage: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    certificateIssued: {
        type: Boolean,
        default: false
    }
});

// Prevent duplicate enrollment
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
