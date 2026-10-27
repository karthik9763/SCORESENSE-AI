const mongoose = require('mongoose');

let isInMemoryFallback = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_performance_db', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    isInMemoryFallback = false;
  } catch (err) {
    console.warn(`⚠️ MongoDB connection error: ${err.message}`);
    console.warn(`⚠️ Running in standalone In-Memory fallback mode so application endpoints remain fully functional!`);
    isInMemoryFallback = true;
  }
};

const getIsInMemory = () => isInMemoryFallback;

module.exports = { connectDB, getIsInMemory };
