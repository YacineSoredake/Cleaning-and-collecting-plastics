const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    mongoose.connect(`${process.env.MONGO_URI}`)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
