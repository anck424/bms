const Certificate = require('../models/Certificate');

// @desc    Get all certificates
// @route   GET /api/certificates
const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    res.json(certificates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:certificateId
const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ 
      certificateId: req.params.certificateId,
      isValid: true 
    });

    if (!certificate) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Certificate not found or invalid' 
      });
    }

    res.json({
      valid: true,
      ...certificate.toObject()
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create new certificate
// @route   POST /api/certificates
const createCertificate = async (req, res) => {
  try {
    const { 
      certificateId, 
      studentName, 
      courseName, 
      completionDate, 
      issueDate, 
      grade, 
      instructor, 
      duration, 
      skills 
    } = req.body;

    const certificate = new Certificate({
      certificateId,
      studentName,
      courseName,
      completionDate,
      issueDate,
      grade,
      instructor,
      duration,
      skills,
      credentialUrl: `https://credentials.bmsacademy.com/verify/${certificateId}`
    });

    await certificate.save();
    res.status(201).json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    await certificate.deleteOne();
    res.json({ message: 'Certificate removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getCertificates,
  verifyCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate
};