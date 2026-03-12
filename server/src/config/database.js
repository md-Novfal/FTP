const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fto_db';
  await mongoose.connect(uri);
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
};

module.exports = connectDB;
