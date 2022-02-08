// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { userInfo } from 'os';
import connectDB from '../../middleware/mongodb';
import User from '../../models/User.scheme';

type Data = {
  name: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const newUser = await new User({
    email: '123@gmail.com',
    pw_hash: '1234',
    user_id: '123',
    username: 'bech',
  });

  await newUser.save();
  res.status(200).json({ name: 'John Doe' });
}

export default connectDB(handler);
