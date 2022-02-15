// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { userInfo } from 'os';
import connectDB from '../../middleware/mongodb';
import Message from '../../models/Message.schema';
import User from '../../models/User.scheme';

type Data = {
  name: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: 'John Doe' });
}

export default connectDB(handler);
