import type { NextApiResponse } from 'next';
import Message from '../../../models/Message.schema';
import authenticate, { AuthRequest } from '../../../middleware/authentication';
import { get_user } from '../../../helpers/user_helper';

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
    const username = <string>req.query.username;
    if (req.body.content) {
      if (req.authenticated && req.user && (req.user.username == username || req.user.admin)) {
        let user = await await get_user({ username: username.toLowerCase() });
        if (user) {
          const newMessage = await new Message({
            author_id: user._id,
            flagged: false,
            pub_date: new Date(),
            text: req.body.content,
            author_name: user.username,
          }).save();
          return res.status(204).send('');
        } else {
          return res.status(404).json({ message: 'No USER' });
        }
      } else {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    } else {
      return res.status(400).json({ message: 'Missing data' });
    }
  } else {
    return res.status(400).json({ message: 'Method not supported!' });
  }
};

export default authenticate(handler);
