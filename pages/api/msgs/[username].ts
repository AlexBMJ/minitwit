import type { NextApiResponse } from 'next';
import Message from '../../../models/Message.schema';
import authenticate, { AuthRequest } from '../../../middleware/authentication';
import { getUser } from '../../../helpers/user_helper';
import MiniTwitRoute from '../../../middleware/MiniTwitRoute';

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  const username = <string>req.query.username;

  if (req.method === 'GET') {
    let amount = <string>req.query.no;

    if (amount == undefined || amount.length < 1) {
      amount = '100';
    }

    const numberAmount = Number(amount);

    if (isNaN(numberAmount)) {
      return res.status(400).json({ message: 'Not a number...' });
    }

    const recentMessages = await Message.find({ username: username }).limit(numberAmount).sort({ pub_date: -1 }).exec();

    return res.status(200).json({ messages: recentMessages });
  }

  if (req.method === 'POST') {
    if (!req.body.content) {
      return res.status(400).json({ message: 'Missing data' });
    }

    if (!(req.authenticated && req.user && (req.user.username == username || req.user.admin))) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await getUser({ username: username.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'No USER' });
    }

    await new Message({
      author_id: user._id,
      flagged: false,
      pub_date: new Date(),
      text: req.body.content,
      username: user.username,
    }).save();
    return res.status(204).send('');
  }

  // This will never be reached
  return res.status(500).send('unreachable');
};

export default MiniTwitRoute(authenticate(handler), ['GET', 'POST'], 'api_msgs_username');
