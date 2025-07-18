const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middlewares/authMiddleware');
const {
  getCertificates,
  verifyCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate
} = require('../controllers/certificateController');

// Public route
router.get('/verify/:certificateId', verifyCertificate);

// Protected admin routes
router.get('/', protect, adminMiddleware, getCertificates);
router.post('/', protect, adminMiddleware, createCertificate);
router.put('/:id', protect, adminMiddleware, updateCertificate);
router.delete('/:id', protect, adminMiddleware, deleteCertificate);

module.exports = router;