const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Payment = require('../models/Payment');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or whatever you are using
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.price <= 0) {
            return res.status(400).json({ message: 'Course is free. Use free enrollment route.' });
        }

        const options = {
            amount: course.price * 100, // Amount in paise
            currency: 'INR',
            receipt: `receipt_order_${Math.floor(Math.random() * 1000)}`
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courseId,
            userDetails // { name, email, phone, collegeName, collegeDetails, personalAddress }
        } = req.body;

        // Verify Signature
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Handle User Creation/Update
        let user = await User.findOne({ email: userDetails.email });
        let password = null;

        if (!user) {
            // Create user
            password = Math.random().toString(36).slice(-8); // Generate 8 char pass
            user = await User.create({
                name: userDetails.name,
                email: userDetails.email,
                password: password,
                tempPassword: password, // Store for admin view
                phone: userDetails.phone,
                collegeName: userDetails.collegeName,
                collegeDetails: userDetails.collegeDetails,
                personalAddress: userDetails.personalAddress,
                role: 'student'
            });

            // Send Email with credentials
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Welcome to Petluri Edutech - Course Enrollment Successful!',
                    html: `
                        <h2>Welcome ${user.name}!</h2>
                        <p>Thank you for enrolling in ${course.title}.</p>
                        <p>Here are your login credentials for our student portal:</p>
                        <ul>
                            <li><strong>Email:</strong> ${user.email}</li>
                            <li><strong>Password:</strong> ${password}</li>
                        </ul>
                        <p>Please log in and change your password as soon as possible.</p>
                        <p>Regards,<br>Petluri Edutech Team</p>
                    `
                };
                transporter.sendMail(mailOptions).catch(err => console.error('Email send failed:', err));
            }
        } else {
            // Update existing user details if they are provided
            user.phone = userDetails.phone || user.phone;
            user.collegeName = userDetails.collegeName || user.collegeName;
            user.collegeDetails = userDetails.collegeDetails || user.collegeDetails;
            user.personalAddress = userDetails.personalAddress || user.personalAddress;
            await user.save();
        }

        // Save Payment
        await Payment.create({
            userId: user._id,
            courseId: course._id,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            amount: course.price,
            status: 'successful'
        });

        // Create Enrollment
        const existingEnrollment = await Enrollment.findOne({ userId: user._id, courseId: course._id });
        if (!existingEnrollment) {
            await Enrollment.create({
                userId: user._id,
                courseId: course._id
            });
        }

        res.status(200).json({ message: 'Payment verified and enrollment successful', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Verification failed', error: error.message });
    }
};

exports.enrollFree = async (req, res) => {
    try {
        const { courseId, userDetails } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.price > 0) {
            return res.status(400).json({ message: 'Course is not free. Payment required.' });
        }

        // Handle User Creation/Update
        let user = await User.findOne({ email: userDetails.email });
        let password = null;

        if (!user) {
            // Create user
            password = Math.random().toString(36).slice(-8); // Generate 8 char pass
            user = await User.create({
                name: userDetails.name,
                email: userDetails.email,
                password: password,
                tempPassword: password, // Store for admin view
                phone: userDetails.phone,
                collegeName: userDetails.collegeName,
                collegeDetails: userDetails.collegeDetails,
                personalAddress: userDetails.personalAddress,
                role: 'student'
            });

            // Send Email with credentials
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Welcome to Petluri Edutech - Course Enrollment Successful!',
                    html: `
                        <h2>Welcome ${user.name}!</h2>
                        <p>Thank you for enrolling in ${course.title}.</p>
                        <p>Here are your login credentials for our student portal:</p>
                        <ul>
                            <li><strong>Email:</strong> ${user.email}</li>
                            <li><strong>Password:</strong> ${password}</li>
                        </ul>
                        <p>Please log in and change your password as soon as possible.</p>
                        <p>Regards,<br>Petluri Edutech Team</p>
                    `
                };
                transporter.sendMail(mailOptions).catch(err => console.error('Email send failed:', err));
            }
        }

        // Create Enrollment
        const existingEnrollment = await Enrollment.findOne({ userId: user._id, courseId: course._id });
        if (!existingEnrollment) {
            await Enrollment.create({
                userId: user._id,
                courseId: course._id
            });
        }

        res.status(200).json({ message: 'Free enrollment successful', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Enrollment failed', error: error.message });
    }
}
