import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import User from '../models/User.scheme';
import { Token } from '../types/jwt';
import * as jwt from 'jsonwebtoken';
import connectDB from './mongodb';

const authenticate = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB(handler);
  if (req.body.content && req.headers.authorization) {
    const splittedAuth = req.headers.authorization?.split(' ');
    if (splittedAuth.length === 2) {
      if (splittedAuth[0] == 'Bearer') {
        var decoded = <Token>jwt.verify(splittedAuth[1], process.env.TOKEN_SECRET!);
        let user = await User.findById(decoded.userid);
        if (user) {
          req.user = user;
        }
        return handler(req, res);
      } else if (splittedAuth[0] == 'Basic') {
      }
    }
  }
};

export default authenticate;
