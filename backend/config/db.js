const mongoose = require('mongoose');

let cached = global._mongooseConnection;
let cachedPromise = global._mongoosePromise;

const connectDB = async () => {
  if (cached && cached.connection.readyState === 1) {
    return cached;
  }

  if (cachedPromise) {
    cached = await cachedPromise;
    global._mongooseConnection = cached;
    return cached;
  }

  try {
    cachedPromise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });
    global._mongoosePromise = cachedPromise;

    cached = await cachedPromise;
    console.log(`MongoDB connected: ${cached.connection.host}`);
    global._mongooseConnection = cached;
    return cached;
  } catch (err) {
    cachedPromise = null;
    global._mongoosePromise = null;
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = connectDB;
