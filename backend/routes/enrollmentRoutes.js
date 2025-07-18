const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middlewares/authMiddleware');
const {
  getEnrollments,
  createEnrollment,
  updateEnrollmentStatus,
  deleteEnrollment
} = require('../controllers/enrollmentController');

// Public route
router.post('/', createEnrollment);

// Protected admin routes
router.get('/', protect, adminMiddleware, getEnrollments);
router.put('/:id', protect, adminMiddleware, updateEnrollmentStatus);
router.delete('/:id', protect, adminMiddleware, deleteEnrollment);

module.exports = router;