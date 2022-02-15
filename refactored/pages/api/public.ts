import type { NextApiRequest, NextApiResponse } from 'next';
import { follow, get_user } from '../../db_helpers/user_helper';
import { verify } from 'jsonwebtoken';
import { Token } from '../../types/jwt';
import { Types } from 'mongoose';
import Message from '../../models/Message.schema';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(400);
  }

  const messages = await Message.find({}).sort({ pub_date: -1 }).limit(30).exec();
  return res.status(200).json(messages);
};
