import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import User, { TUser } from '../models/User.scheme';
import { Token } from '../types/jwt';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { compare } from 'bcryptjs';
import { get_user } from '../helpers/user_helper';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const authenticate = (handler: NextApiHandler) => async (req: AuthRequest, res: NextApiResponse) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.CONNECTION_STRING!);
  }
  let user;
  if (req.headers.authorization) {
    const splittedAuth = req.headers.authorization?.split(' ');
    if (splittedAuth.length === 2) {
      if (splittedAuth[0] == 'Bearer') {
        var decoded = <Token>jwt.verify(splittedAuth[1], process.env.TOKEN_SECRET!);
        user = await User.findById(decoded.userid);
      } else if (splittedAuth[0] == 'Basic') {
        let creds = Buffer.from(splittedAuth[1], 'base64').toString('ascii').split(':', 2);
        let check_user = await get_user({ username: creds[0] });
        if (check_user) {
          const result = await compare(creds[1], check_user.pw_hash);
          if (result) {
            user = check_user;
          }
        }
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
