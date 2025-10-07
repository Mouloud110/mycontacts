const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  console.log('🔍 URI lue:', JSON.stringify(uri));
  console.log('🔍 Longueur:', uri ? uri.length : 0);
  if (!uri) throw new Error('Missing MONGODB_URI');
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  console.log('✅ MongoDB connected');
}
module.exports = connectDB;
