const mongoose = require('mongoose');

let cached = global._mongooseConnection;

const connectDB = async () => {
  if (cached) {
    return cached;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    cached = conn;
    global._mongooseConnection = cached;
    return conn;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = connectDB;
