const mongoose = require('mongoose');
const env = require('./env');
const logger = require('./logger');

async function connectDb() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== 'production'
  });
  logger.info('MongoDB connected');
}

module.exports = connectDb;
