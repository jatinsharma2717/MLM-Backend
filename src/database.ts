import mongoose from 'mongoose';

const uri: string = 'mongodb+srv://jatinsharmaaj:123456Jhu@cluster0.nxypk97.mongodb.net/MLM';

export const connectDatabase = async () => {
  try {
    mongoose.connect(uri, {
    });

    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};
