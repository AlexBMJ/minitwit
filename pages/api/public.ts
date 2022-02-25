import type { NextApiRequest, NextApiResponse } from 'next';
import Message from '../../models/Message.schema';
import MiniTwitRoute from "../../helpers/api_helper";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const messages = await Message
    .aggregate()
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

export default MiniTwitRoute(handler, 'GET');