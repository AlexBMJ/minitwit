import type { NextApiRequest, NextApiResponse } from 'next';
import setlatest from '../../helpers/latest_helper';
import Message from '../../models/Message.schema';
import MiniTwitRoute from "../../middleware/MiniTwitRoute";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  setlatest(req);
  let amount = <string>req.query.no;
  if (amount == undefined || amount.length < 1) {
    amount = '100';
  }
  const numberAmount = Number(amount);
  if (!isNaN(numberAmount)) {
    const recentMessages = await Message.find({}).limit(numberAmount).sort({ pub_date: -1 }).exec();

    return res.status(200).json({ messages: recentMessages });
  } else {
    return res.status(400).json({ message: 'Not a number...' });
  }
};

export default MiniTwitRoute(handler, 'GET');
