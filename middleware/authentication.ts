import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import User, {TUser} from '../models/User.scheme';
import {Token} from '../types/jwt';
import * as jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {compare} from 'bcryptjs';
import {getUser} from '../helpers/user_helper';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const authenticate = (handler: NextApiHandler) => async (req: AuthRequest, res: NextApiResponse) => {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.CONNECTION_STRING!);
  }

  req.authenticated = false;

  if (!req.headers.authorization) {
    return handler(req, res);
  }

  const splittedAuth = req.headers.authorization?.split(' ');

  if (splittedAuth.length !== 2) {
    return handler(req, res);
  }

  let user;

  if (splittedAuth[0] == 'Bearer') {
    const decoded = <Token>jwt.verify(splittedAuth[1], process.env.TOKEN_SECRET!);
    user = await User.findById(decoded.userid);
  } else if (splittedAuth[0] == 'Basic') {
    let creds = Buffer.from(splittedAuth[1], 'base64').toString('ascii').split(':', 2);
    let check_user = await getUser({username: creds[0]});

    if (!check_user) {
      return handler(req, res);
    }

    const result = await compare(creds[1], check_user.pw_hash);

    if (result) {
      user = check_user;
    }
  }

  if (user) {
    req.user = user;
    req.authenticated = true;
  }

  return handler(req, res);
};

export default authenticate;
