const mongoose = require('mongoose');

const DEFAULT_LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/bestinfra';

function getMongoUri() {
  if (process.env.MONGO_URI) {
    return process.env.MONGO_URI;
  }

  if (process.env.NODE_ENV !== 'production') {
    return DEFAULT_LOCAL_MONGO_URI;
  }

  throw new Error('MONGO_URI is required in production. Set it in the Render environment variables.');
}

async function connectDatabase() {
  const mongoUri = getMongoUri();

  await mongoose.connect(mongoUri);
}

module.exports = { connectDatabase };
