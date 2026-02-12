const Course = require('../models/Course');

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
const getPublicCourses = async (req, res) => {
    try {
        // Only return published courses
        const courses = await Course.find({ isPublished: true })
            .select('-videos -quizzes') // Exclude content, just show meta
            .sort({ createdAt: -1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single published course
// @route   GET /api/courses/:id
// @access  Public
const getSingleCourse = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.id, isPublished: true });

        if (!course) {
            return res.status(404).json({ message: 'Course not found or not published' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPublicCourses, getSingleCourse };
