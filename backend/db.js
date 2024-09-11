import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://princeleo:princeleo@cluster0.fti3h.mongodb.net/');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDB;
