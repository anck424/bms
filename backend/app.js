const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
require('./config/db')();

const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const enrollmentRoutes = require('./routes/enrollments');
const job = require('./config/cron'); // ✅ Import the cron job

// Start cron job only in non-production
if (process.env.NODE_ENV === 'production') {
  job.start();
}

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://bms-two-bay.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contact', require('./routes/contact'));
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/enrollments', enrollmentRoutes);

app.get('/', (req, res) => res.send('API is running...'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

module.exports = app;
