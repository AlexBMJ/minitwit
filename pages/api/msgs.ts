import type { NextApiRequest, NextApiResponse } from 'next';
import Message from '../../models/Message.schema';
import MiniTwitRoute from "../../helpers/api_helper";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const amount = <string>req.query.amount;
  const numberAmount = Number(amount);

  if (!isNaN(numberAmount)) {
    const recentMessages = await Message.find({}).limit(numberAmount).sort({pub_date: -1}).exec();
    return res.status(200).json({messages: recentMessages});
  }

  return res.status(400).json({message: 'Not a number...'});
};

export default MiniTwitRoute(handler, 'GET');
