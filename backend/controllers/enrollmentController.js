const Enrollment = require('../models/Enrollment');
const nodemailer = require('nodemailer');

// @desc    Get all enrollments
// @route   GET /api/enrollments
const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create new enrollment
// @route   POST /api/enrollments
const createEnrollment = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, education, course, startDate } = req.body;

    if (!firstName || !lastName || !email || !phone || !course) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const enrollment = new Enrollment({
      firstName,
      lastName,
      email,
      phone,
      education,
      course,
      startDate
    });

    await enrollment.save();

    // Send notification email
    try {
      const transporter = nodemailer.createTransporter({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"BMS Academy Enrollments" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Course Enrollment: ${firstName} ${lastName}`,
        html: `
          <h2>New Course Enrollment</h2>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Course:</strong> ${course}</p>
          <p><strong>Education:</strong> ${education}</p>
          <p><strong>Preferred Start Date:</strong> ${startDate}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Enrollment submitted successfully',
      enrollment 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update enrollment status
// @route   PUT /api/enrollments/:id
const updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    await enrollment.deleteOne();
    res.json({ message: 'Enrollment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getEnrollments,
  createEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment
};