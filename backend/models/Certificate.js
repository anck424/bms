const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  courseName: { type: String, required: true },
  completionDate: { type: Date, required: true },
  issueDate: { type: Date, required: true },
  grade: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  skills: [{ type: String }],
  credentialUrl: { type: String },
  isValid: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certificate', certificateSchema);