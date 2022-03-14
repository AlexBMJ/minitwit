import type { NextApiRequest, NextApiResponse } from 'next';
import Message from '../../models/Message.schema';
import MiniTwitRoute from "../../middleware/MiniTwitRoute";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let amount = <string>req.query.no;

  if (amount == undefined || amount.length < 1) {
    amount = '100';
  }

  const numberAmount = Number(amount);

  if (isNaN(numberAmount)) {
    return res.status(400).json({message: 'Not a number...'});
  }

  const recentMessages = await Message.find({}).limit(numberAmount).sort({pub_date: -1}).exec();
  return res.status(200).json({messages: recentMessages});
};

export default MiniTwitRoute(handler, ['GET']);
