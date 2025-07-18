const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middlewares/authMiddleware');
const {
  getOffers,
  getActiveOffers,
  createOffer,
  updateOffer,
  deleteOffer
} = require('../controllers/offerController');

// Public routes
router.get('/active', getActiveOffers);

// Protected admin routes
router.get('/', protect, adminMiddleware, getOffers);
router.post('/', protect, adminMiddleware, createOffer);
router.put('/:id', protect, adminMiddleware, updateOffer);
router.delete('/:id', protect, adminMiddleware, deleteOffer);

module.exports = router;