const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// @desc    Get all contacts
// @route   GET /api/contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create new contact
// @route   POST /api/contacts
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message
    });

    await contact.save();

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
        from: `"BMS Academy Contact Form" <${process.env.EMAIL_USER}>`,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        replyTo: email,
        subject: subject || `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
    }

    res.status(201).json({ success: true, contact });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update contact status
// @route   PUT /api/contacts/:id
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.deleteOne();
    res.json({ message: 'Contact removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact
};