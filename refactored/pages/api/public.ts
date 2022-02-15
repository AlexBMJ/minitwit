import type { NextApiRequest, NextApiResponse } from 'next';
import Message from '../../models/Message.schema';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(400);
  }

  const messages = await Message.aggregate()
    .lookup({
      from: 'users',
      localField: 'author_id',
      foreignField: 'user_id',
      as: 'users',
    })
    .sort({ pub_date: -1 })
    .limit(30)
    .exec();

  return res.status(200).json(messages);
};
