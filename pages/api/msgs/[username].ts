import type { NextApiResponse } from 'next';
import Message, { TMessage } from '../../../models/Message.schema';
import authenticate, { AuthRequest } from '../../../middleware/authentication';
import { getUser } from '../../../helpers/user_helper';
import MiniTwitRoute from '../../../middleware/MiniTwitRoute';

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  const username = <string>req.query.username;

  if (req.method === 'GET') {
    let amount = <string>req.query.no;
    const before = <string>req.query.before;
    const after = <string>req.query.after;

    if (amount == undefined || amount.length < 1) {
      amount = '20';
    }

    const numberAmount = Number(amount);
    const numberBefore = Number(before);
    const numberAfter = Number(after);

    if (isNaN(numberAmount)) {
      return res.status(400).json({ message: 'Not a number...' });
    }

    let recentMessages: TMessage[];
    if (!isNaN(numberBefore) && isNaN(numberAfter)) {
      const beforeDate = new Date(numberBefore);
      recentMessages = await Message.find({
        username: username,
        pub_date: {
          $lt: beforeDate,
        },
      })
        .sort({ pub_date: -1 })
        .limit(numberAmount)
        .exec();
    } else if (isNaN(numberBefore) && !isNaN(numberAfter)) {
      const afterDate = new Date(numberAfter);
      recentMessages = await Message.find({
        username: username,
        pub_date: {
          $gt: afterDate,
        },
      })
        .sort({ pub_date: -1 })
        .limit(numberAmount)
        .exec();
    } else if (!isNaN(numberBefore) && !isNaN(numberAfter)) {
      const beforeDate = new Date(numberBefore);
      const afterDate = new Date(numberAfter);
      recentMessages = await Message.find({
        username: username,
        pub_date: {
          $gt: afterDate,
          $lt: beforeDate,
        },
      })
        .sort({ pub_date: -1 })
        .limit(numberAmount)
        .exec();
    } else {
      recentMessages = await Message.find({ username: username }).sort({ pub_date: -1 }).limit(numberAmount).exec();
    }
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
