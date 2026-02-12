const express = require('express');
const router = express.Router();
const {
    getDashboard,
    getMyCourses,
    getCourseDetails,
    completeVideo,
    submitQuiz,
    getCertificates
} = require('../controllers/studentController');
const { protect } = require('../middlewares/authMiddleware');
const { studentOnly } = require('../middlewares/roleMiddleware');

router.use(protect);
router.use(studentOnly);

router.get('/dashboard', getDashboard);
router.get('/courses', getMyCourses);
router.get('/course/:id', getCourseDetails);
router.post('/video/complete', completeVideo);
router.post('/quiz/submit', submitQuiz);
router.get('/certificates', getCertificates);

module.exports = router;
