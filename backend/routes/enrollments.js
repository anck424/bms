const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Store enrollments in memory (in production, use a database)
let enrollments = [];

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, education, course, startDate } = req.body;

    if (!firstName || !lastName || !email || !phone || !course) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create enrollment record
    const enrollment = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone,
      education,
      course,
      startDate,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    enrollments.push(enrollment);

    // Send notification email (optional)
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
      // Don't fail the enrollment if email fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'Enrollment submitted successfully',
      enrollmentId: enrollment.id 
    });
  } catch (error) {
    console.error('Error processing enrollment:', error);
    res.status(500).json({ error: 'Failed to process enrollment' });
  }
});

// Get all enrollments (for admin dashboard)
router.get('/', (req, res) => {
  res.json(enrollments);
});

// Get enrollment by ID
router.get('/:id', (req, res) => {
  const enrollment = enrollments.find(e => e.id === parseInt(req.params.id));
  if (!enrollment) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }
  res.json(enrollment);
});

// Update enrollment status
router.put('/:id', (req, res) => {
  const { status } = req.body;
  const enrollmentIndex = enrollments.findIndex(e => e.id === parseInt(req.params.id));
  
  if (enrollmentIndex === -1) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  enrollments[enrollmentIndex].status = status;
  enrollments[enrollmentIndex].updatedAt = new Date().toISOString();

  res.json(enrollments[enrollmentIndex]);
});

// Delete enrollment
router.delete('/:id', (req, res) => {
  const enrollmentIndex = enrollments.findIndex(e => e.id === parseInt(req.params.id));
  
  if (enrollmentIndex === -1) {
    return res.status(404).json({ error: 'Enrollment not found' });
  }

  enrollments.splice(enrollmentIndex, 1);
  res.json({ message: 'Enrollment deleted successfully' });
});

module.exports = router;