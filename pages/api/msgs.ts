import type { NextApiRequest, NextApiResponse } from 'next';
import Message, { TMessage } from '../../models/Message.schema';
import MiniTwitRoute from '../../middleware/MiniTwitRoute';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
      pub_date: {
        $gt: afterDate,
        $lt: beforeDate,
      },
    })
      .sort({ pub_date: -1 })
      .limit(numberAmount)
      .exec();
  } else {
    recentMessages = await Message.find().sort({ pub_date: -1 }).limit(numberAmount).exec();
  }
  return res.status(200).json({ messages: recentMessages });
};

export default MiniTwitRoute(handler, ['GET'], 'api_msgs');
