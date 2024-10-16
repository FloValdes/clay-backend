import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import pageRoutes from './routes/page.routes';

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
}));

// MongoDB connection
const mongoUri = process.env.MONGODB_CONNECT_URI as string;

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

app.use('/pages', pageRoutes);

export default app;
