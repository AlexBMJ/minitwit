import type { NextApiRequest, NextApiResponse } from 'next';
import Message from '../../../models/Message.schema';
import authenticate, { AuthRequest } from '../../../middleware/authentication';

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const amount = <string>req.query.no;
    const numberAmount = Number(amount);

    if (numberAmount !== NaN) {
      const recentMessages = await Message.find({}).limit(numberAmount).sort({ pub_date: -1 }).exec();

      return res.status(200).json({ messages: recentMessages });
    } else {
      return res.status(400).json({ message: 'Not a number...' });
    }
  } else if (req.method === 'POST') {
    if (req.body.content) {
      if (req.authenticated && req.user) {
        const newMessage = await new Message({
          author_id: req.user._id,
          flagged: false,
          pub_date: new Date(),
          text: req.body.content,
          author_name: req.user.username,
        }).save();

        return res.status(200).json({ message: 'Created!', data: newMessage });
      } else {
        return res.status(401).json({ message: 'No USER' });
      }
    } else {
      res.status(400).json({ message: 'Missing data' });
    }
  } else {
    return res.status(400).json({ message: 'Method not supported!' });
  }
};

export default authenticate(handler);
