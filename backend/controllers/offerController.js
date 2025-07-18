const Offer = require('../models/Offer');

// @desc    Get all offers
// @route   GET /api/offers
const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get active offers
// @route   GET /api/offers/active
const getActiveOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ 
      isActive: true, 
      validUntil: { $gte: new Date() } 
    }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create new offer
// @route   POST /api/offers
const createOffer = async (req, res) => {
  try {
    const { title, discount, validUntil, description, code, conditions } = req.body;

    const offer = new Offer({
      title,
      discount,
      validUntil,
      description,
      code,
      conditions
    });

    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    await offer.deleteOne();
    res.json({ message: 'Offer removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getOffers,
  getActiveOffers,
  createOffer,
  updateOffer,
  deleteOffer
};