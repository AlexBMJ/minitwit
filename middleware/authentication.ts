import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import User from '../models/User.scheme';
import { Token } from '../types/jwt';
import * as jwt from 'jsonwebtoken';

const authenticate = (handler: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body.content && req.headers.authorization) {
    const splittedAuth = req.headers.authorization?.split(' ');
  
    if (splittedAuth.length === 2) {
      var decoded = <Token>jwt.verify(splittedAuth[1], process.env.TOKEN_SECRET!);
      let user = await User.findById(decoded.userid);
      if (user) {
  return handler(req, res);
};

export default authenticate;
