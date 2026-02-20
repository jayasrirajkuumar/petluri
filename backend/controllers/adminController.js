const Course = require('../models/Course');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Quiz = require('../models/Quiz');
const Payment = require('../models/Payment');
const sendEmail = require('../services/emailService');
const crypto = require('crypto'); // For random password

// @desc    Create a new course
// @route   POST /api/admin/courses
// @access  Private/Admin
// Helper: Validate Program for Publishing
const validateProgram = (data) => {
    const errors = [];

    // 1. Basic Details
    if (!data.title) errors.push("Program title is required");
    if (!data.description) errors.push("Description is required");
    if (!data.type) errors.push("Program type is required");
    if (!data.level) errors.push("Difficulty level is required");
    if (!data.duration) errors.push("Duration is required");

    // 2. Price Logic
    if (data.type !== 'free') {
        if (!data.price || data.price <= 0) errors.push("Price > 0 is required for paid programs");
    } else {
        if (data.price > 0) errors.push("Free programs must have price = 0");
    }

    // 3. Module & Content Logic (Common for all except Internship? User said Internship doesn't need videos)
    // "INTERNSHIP PROGRAM (No videos)"
    if (data.type !== 'internship') {
        if (!data.modules || data.modules.length === 0) {
            errors.push("At least one module is required");
        } else {
            let hasContent = false;
            data.modules.forEach((mod, idx) => {
                if (!mod.content || mod.content.length === 0) {
                    errors.push(`Module ${idx + 1} (${mod.title}) is empty`);
                } else {
                    hasContent = true;
                    // Check for at least one video if it's a video-based program
                    // User said: "At least 1 module... Each module must contain: At least 1 video" 
                    // Wait, "Each module must contain: At least 1 video"? Or just "At least 1 module"?
                    // User said: "At least 1 module... Each module must contain: At least 1 video". 
                    // Let's enforce strict rule: Every module must have at least one video (or maybe content?).
                    // Let's assume "At least one item of content" is the hard rule, and "At least 1 video" implies the program must have content.
                    // Actually, the requirement says: "Each module must contain: At least 1 video". 
                    // This is quite strict. Let's verify if `type` is video based.
                    // "VIDEO-BASED PROGRAMS (Free / Certification / Professional)" -> Yes.

                    const hasVideo = mod.content.some(c => c.type === 'video');
                    if (!hasVideo) errors.push(`Module ${idx + 1} must contain at least one video`);
                }
            });
            if (!hasContent) errors.push("Program must have content");
        }
    }

    // 4. Certification specific
    if (data.type === 'certification') {
        if (!data.certificateTemplate) {
            errors.push("Certification programs must have a certificate background image.");
        }
    }

    // 5. Internship Logic
    if (data.type === 'internship') {
        // "Internship description... Duration... Outcome"
        // These map to standard fields?
        // "Video modules NOT required"
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// @desc    Create a new course
// @route   POST /api/admin/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    try {
        const { title, description, type, level, duration, price, videos, modules, image, certificateTemplate, status } = req.body;

        // Generate Program Code
        const prefixes = {
            'free': 'FC',
            'certification': 'CP',
            'professional': 'PMC',
            'internship': 'IP'
        };
        const prefix = prefixes[type] || 'PROG';
        const randomNum = Math.floor(10000 + Math.random() * 90000); // 5 digit random number
        const programCode = `${prefix}-${randomNum}`; // e.g. FC-12345

        let finalStatus = status || 'draft';
        let isPublished = finalStatus === 'published';

        // Validation if trying to publish
        if (finalStatus === 'published') {
            const validation = validateProgram(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    message: "Cannot publish invalid program",
                    errors: validation.errors
                });
            }
        }

        const course = await Course.create({
            programCode,
            title,
            description,
            type,
            level,
            duration,
            price,
            image: image || '',
            certificateTemplate: certificateTemplate || '',
            modules: modules || [],
            videos: videos || [], // Legacy support
            status: finalStatus,
            isPublished: isPublished,
            createdBy: req.user._id
        });

        // Link Quizzes
        await linkQuizzesToCourse(course._id, modules);

        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/admin/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    try {
        const { status, modules } = req.body;

        let updateData = { ...req.body };

        // If status is changing to published, or is already published and being updated
        // actually, we should validate if the RESULTING state is valid.
        // But for simplicity, if request says status='published', we validate the incoming body merged with existing? 
        // Or just the incoming body if it's a full update?
        // PUT usually replaces, but often used as PATCH. 
        // Let's assume req.body contains the full form data from the UI wizard.

        if (status === 'published') {
            const validation = validateProgram(req.body);
            if (!validation.isValid) {
                return res.status(400).json({
                    message: "Cannot publish invalid program",
                    errors: validation.errors
                });
            }
            updateData.isPublished = true;
        } else if (status === 'draft' || status === 'archived') {
            updateData.isPublished = false;
        }

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });

        // Link Quizzes
        if (modules) {
            await linkQuizzesToCourse(updatedCourse._id, modules);
        }

        res.json(updatedCourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/admin/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Ideally, check for enrollments before deleting?
        // For now, allow force delete or cascade? 
        // Mongoose middleware might trigger cascade if configured. 
        // Let's just delete the course.

        await Course.findByIdAndDelete(req.params.id);

        res.json({ message: 'Course removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all courses (Admin View)
// @route   GET /api/admin/courses
// @access  Private/Admin
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).sort({ createdAt: -1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single course by ID
// @route   GET /api/admin/courses/:id
// @access  Private/Admin
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new student (Auto-generate password)
// @route   POST /api/admin/create-student
// @access  Private/Admin
const createStudent = async (req, res) => {
    const { name, email } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate random password
        const password = crypto.randomBytes(8).toString('hex');

        const user = await User.create({
            name,
            email,
            password, // Hook will hash it
            tempPassword: password, // For admin to view
            role: 'student'
        });

        // Send Email
        const message = `
            <h1>Welcome to Petluri Edutech LMS</h1>
            <p>Your account has been created successfully.</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p>Please login and change your password immediately.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Your Student Account Credentials',
                html: message,
                message: `Email: ${email}, Password: ${password}` // fallback
            });
        } catch (emailError) {
            console.error('Email send failed', emailError);
            // Don't fail the request, just log it
        }

        res.status(201).json({
            message: 'Student created and email sent',
            user: { _id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manually enroll a student
// @route   POST /api/admin/enroll-student
// @access  Private/Admin
const enrollStudent = async (req, res) => {
    const { userId, courseId } = req.body;

    try {
        const enrollmentExists = await Enrollment.findOne({ userId, courseId });

        if (enrollmentExists) {
            return res.status(400).json({ message: 'Student already enrolled' });
        }

        const enrollment = await Enrollment.create({
            userId,
            courseId,
            status: 'active'
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    View Student Credentials (requires admin validation)
// @route   POST /api/admin/enrollments/:id/credentials
// @access  Private/Admin
const getStudentCredentials = async (req, res) => {
    try {
        const { adminPassword } = req.body;
        const studentId = req.params.id;

        // Verify admin password
        const adminUser = await User.findById(req.user._id).select('+password');
        if (!adminUser) return res.status(401).json({ message: 'Admin not found' });

        const isMatch = await adminUser.matchPassword(adminPassword);
        if (!isMatch) return res.status(401).json({ message: 'Invalid admin password' });

        // Retrieve student
        const student = await User.findById(studentId).select('+tempPassword');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        res.json({
            email: student.email,
            password: student.tempPassword || 'Password intentionally removed or not generated'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve credentials', error: error.message });
    }
};

// @desc    Resend Student Credentials
// @route   POST /api/admin/enrollments/:id/resend-credentials
// @access  Private/Admin
const resendStudentCredentials = async (req, res) => {
    try {
        const studentId = req.params.id;
        const student = await User.findById(studentId).select('+tempPassword');

        if (!student) return res.status(404).json({ message: 'Student not found' });

        const rawPassword = student.tempPassword || 'Not Available (User may have reset it)';

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({ message: 'Email service is not configured on the server.' });
        }

        const message = `
            <h2>Hello ${student.name},</h2>
            <p>Your login credentials have been requested to be resent to you.</p>
            <ul>
                <li><strong>Email:</strong> ${student.email}</li>
                <li><strong>Password/Secret:</strong> ${rawPassword}</li>
            </ul>
            <p>Please log in and ensure your information is secure.</p>
            <p>Regards,<br>Petluri Edutech</p>
        `;

        await sendEmail({
            email: student.email,
            subject: 'Your Petluri Edutech Login Credentials',
            html: message,
            message: `Email: ${student.email}, Password: ${rawPassword}`
        });

        res.json({ message: 'Credentials email sent to student successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to resend credentials', error: error.message });
    }
};

// @desc    Create a quiz
// @route   POST /api/admin/create-quiz
// @access  Private/Admin
const createQuiz = async (req, res) => {
    try {
        const { title, courseId, questions, passingScore, timeLimit } = req.body;

        const quiz = await Quiz.create({
            title,
            courseId,
            questions,
            passingScore,
            timeLimit
        });

        // Link quiz to course if courseId is provided
        if (courseId) {
            await Course.findByIdAndUpdate(courseId, {
                $push: { quizzes: quiz._id }
            });
        }

        res.status(201).json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mock Upload Video/Image (returns parsed metadata)
// @route   POST /api/admin/upload-video
// @access  Private/Admin
const uploadVideo = async (req, res) => {
    // In production, Multer would handle the file and upload to S3.
    // Here we just mock the response.
    const { filename, type } = req.body;

    if (type === 'image') {
        return res.json({
            message: 'Image metadata received',
            url: 'https://via.placeholder.com/800x400.png?text=Course+Banner', // Mock image
            filename: filename || 'banner.png'
        });
    }

    res.json({
        message: 'Video metadata received',
        url: 'https://example.com/video-placeholder.mp4',
        filename: filename || 'video.mp4'
    });
};

// @desc    Get all enrollments
// @route   GET /api/admin/enrollments
// @access  Private/Admin
const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({})
            .populate('userId', 'name email phone collegeName collegeDetails personalAddress')
            .populate('courseId', 'title type price programCode')
            .sort({ createdAt: -1 })
            .lean();

        // Fetch corresponding payments for each enrollment
        const enrichedEnrollments = await Promise.all(enrollments.map(async (enrollment) => {
            const payment = await Payment.findOne({
                userId: enrollment.userId?._id,
                courseId: enrollment.courseId?._id
            }).sort({ createdAt: -1 }).lean();

            return {
                ...enrollment,
                paymentDetails: payment || null
            };
        }));

        res.json(enrichedEnrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all quizzes
// @route   GET /api/admin/quizzes
// @access  Private/Admin
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('courseId', 'title');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Students
        const totalStudents = await User.countDocuments({ role: 'student' });

        // 2. Total Enrollments
        const totalEnrollments = await Enrollment.countDocuments({});

        // 3. Enrollments by Type
        const enrollmentsByType = await Enrollment.aggregate([
            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: '$course' },
            {
                $group: {
                    _id: '$course.type',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format enrollmentsByType into an easier object
        const enrollmentStats = {
            free: 0,
            certification: 0,
            professional: 0,
            internship: 0
        };
        enrollmentsByType.forEach(stat => {
            if (stat._id) enrollmentStats[stat._id] = stat.count;
        });

        // 4. Total Active & Draft Courses
        const totalActiveCourses = await Course.countDocuments({ isPublished: true });
        const totalDraftCourses = await Course.countDocuments({ isPublished: false });


        // 5. Top 5 High Enrollment Courses
        const topCourses = await Enrollment.aggregate([
            {
                $group: {
                    _id: '$courseId',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: '$course' },
            {
                $project: {
                    _id: 0,
                    courseId: '$_id',
                    title: '$course.title',
                    count: 1
                }
            }
        ]);

        // 6. Total Video Hours
        // Fetching all courses to calculate duration in JS as it's safer for mixed formats
        const courses = await Course.find({}, 'videos.duration modules');
        let totalSeconds = 0;

        courses.forEach(course => {
            // Legacy videos
            if (course.videos && course.videos.length > 0) {
                course.videos.forEach(video => {
                    if (video.duration) {
                        const parts = video.duration.split(':').map(Number);
                        if (parts.length === 2) {
                            totalSeconds += parts[0] * 60 + parts[1];
                        } else if (parts.length === 3) {
                            totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
                        }
                    }
                });
            }

            // New modules
            if (course.modules && course.modules.length > 0) {
                course.modules.forEach(module => {
                    if (module.content && module.content.length > 0) {
                        module.content.forEach(item => {
                            if (item.type === 'video' && item.duration) {
                                const parts = item.duration.split(':').map(Number);
                                if (parts.length === 2) {
                                    totalSeconds += parts[0] * 60 + parts[1];
                                } else if (parts.length === 3) {
                                    totalSeconds += parts[0] * 3600 + parts[1] * 60 + parts[2];
                                }
                            }
                        });
                    }
                });
            }
        });

        const totalHours = Math.round(totalSeconds / 3600);

        res.json({
            totalStudents,
            totalEnrollments,
            enrollmentStats,
            totalActiveCourses,
            totalDraftCourses,
            totalHours,
            topCourses
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Helper to link quizzes to course
const linkQuizzesToCourse = async (courseId, modules) => {
    if (!modules || modules.length === 0) return;

    const quizIds = [];
    modules.forEach(mod => {
        if (mod.content) {
            mod.content.forEach(item => {
                if (item.type === 'quiz' && item.quizId) {
                    quizIds.push(item.quizId);
                }
            });
        }
    });

    if (quizIds.length > 0) {
        // Bulk update quizzes to set courseId
        await Quiz.updateMany(
            { _id: { $in: quizIds } },
            { $set: { courseId: courseId } }
        );
    }
};

// ... (existing code)

// @desc    Get single quiz by ID
// @route   GET /api/admin/quizzes/:id
// @access  Private/Admin
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a quiz
// @route   PUT /api/admin/quizzes/:id
// @access  Private/Admin
const updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.json(updatedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCourse,
    updateCourse,
    getAllCourses,
    getCourseById,
    getAllStudents,
    enrollStudent,
    getAllEnrollments,
    createStudent,
    getStudentCredentials,
    resendStudentCredentials,
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    getDashboardStats,
    uploadVideo,
    deleteCourse,
    linkQuizzesToCourse // Exporting for use in controllers if needed, but here it's internal helper
};
