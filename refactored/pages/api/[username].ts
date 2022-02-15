import type { NextApiRequest, NextApiResponse } from 'next';
import { get_user } from '../../db_helpers/user_helper';
import Message from '../../models/Message.schema';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const user_obj = await get_user({ username: req.query.username[0] });
    if (user_obj && user_obj._id && user_obj.username && user_obj.email) {
        let messages = await Message.find({author_id: user_obj._id})
        return res.status(200).json({username: user_obj.username, email: user_obj.email, messages: messages});
    }
    return res.status(404);
  }
  return res.status(400);
};

export default handler;
