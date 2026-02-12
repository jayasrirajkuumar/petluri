const express = require('express');
const router = express.Router();
const { getPublicCourses, getSingleCourse } = require('../controllers/publicController');

router.get('/', getPublicCourses);
router.get('/:id', getSingleCourse);

module.exports = router;
