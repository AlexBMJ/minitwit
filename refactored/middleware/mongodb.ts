import mongoose from 'mongoose';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import User from '../models/User.scheme';

const connectDB = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  await mongoose.connect(process.env.CONNECTION_STRING!);
  return handler(req, res);
};

export default connectDB;
