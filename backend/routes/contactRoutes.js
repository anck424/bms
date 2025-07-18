const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middlewares/authMiddleware');
const {
  getContacts,
  createContact,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');

// Public route
router.post('/', createContact);

// Protected admin routes
router.get('/', protect, adminMiddleware, getContacts);
router.put('/:id', protect, adminMiddleware, updateContactStatus);
router.delete('/:id', protect, adminMiddleware, deleteContact);

module.exports = router;