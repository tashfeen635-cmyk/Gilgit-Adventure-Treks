require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./backend/config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files — public site
app.use(express.static(path.join(__dirname)));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/destinations', require('./backend/routes/destinations'));
app.use('/api/reviews', require('./backend/routes/reviews'));
app.use('/api/deals', require('./backend/routes/deals'));
app.use('/api/bookings', require('./backend/routes/bookings'));
app.use('/api/subscribers', require('./backend/routes/subscribers'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
