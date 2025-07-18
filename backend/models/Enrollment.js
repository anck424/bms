const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  education: { type: String, required: true },
  course: { type: String, required: true },
  startDate: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'enrolled'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);