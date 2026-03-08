const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bestinfra';

  await mongoose.connect(mongoUri);
}

module.exports = { connectDatabase };
