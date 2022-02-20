import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import User, { TUser } from '../models/User.scheme';
import { Token } from '../types/jwt';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const authenticate = (handler: NextApiHandler) => async (req: AuthRequest, res: NextApiResponse) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.CONNECTION_STRING!);
  }
  let user;
  req.authenticated = false;
  if (req.body.content && req.headers.authorization) {
    const splittedAuth = req.headers.authorization?.split(' ');
    if (splittedAuth.length === 2) {
      if (splittedAuth[0] == 'Bearer') {
        var decoded = <Token>jwt.verify(splittedAuth[1], process.env.TOKEN_SECRET!);
        user = await User.findById(decoded.userid);
      } else if (splittedAuth[0] == 'Basic') {
        let creds = Buffer.from(splittedAuth[1], 'base64').toString('ascii').split(':', 1);
        user = await User.findOne({ username: creds[0].toLowerCase(), password: creds[1] });
      }
    }
  }
  if (user) {
    req.user = user;
    req.authenticated = true;
  }
  return handler(req, res);
};

export default authenticate;
