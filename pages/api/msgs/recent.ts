import type { NextApiRequest, NextApiResponse } from 'next';
import Message from '../../../models/Message.schema';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const amount = <string>req.query.amount;
    const numberAmount = Number(amount);

    if (numberAmount !== NaN) {
      const recentMessages = await Message.find({}).limit(numberAmount).sort({ pub_date: -1 }).exec();

      return res.status(200).json({ messages: recentMessages });
    } else {
      return res.status(400).json({ message: 'Not a number...' });
    }
  } else {
    return res.status(400).json({ message: 'Method not supported!' });
  }
};

export default handler;
