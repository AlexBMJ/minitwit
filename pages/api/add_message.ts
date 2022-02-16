import type { NextApiRequest, NextApiResponse } from 'next';
import Message from '../../models/Message.schema';
import { Token } from '../../types/jwt';
import * as jwt from 'jsonwebtoken';
import User from '../../models/User.scheme';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (req.body.message && req.headers.authorization) {
      const splittedAuth = req.headers.authorization?.split(' ');

      if (splittedAuth.length === 2) {
        var decoded = <Token>jwt.verify(splittedAuth[1], process.env.TOKEN_SECRET!);
        let user = await User.findById(decoded.userid);
        if (user) {
          const newMessage = await new Message({
            author_id: user._id,
            flagged: false,
            pub_date: new Date(),
            text: req.body.message,
            author_name: user.username,
          }).save();

          return res.status(200).json({ message: 'Created!', data: newMessage });
        } else {
          return res.status(401).json({ message: 'No USER' });
        }
      } else {
        return res.status(401).json({ message: 'No JWT' });
      }
    } else {
      res.status(400).json({ message: 'Missing data' });
    }
  } else {
    res.status(400).json({ message: 'Method not supported!' });
  }
};

export default handler;
