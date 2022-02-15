// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../middleware/mongodb';
import User, { TUser } from '../../models/User.scheme';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Token } from '../../types/jwt';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (req.headers.authorization) {
      var decoded = <Token>jwt.verify(req.headers.authorization?.split(' ')[1], process.env.TOKEN_SECRET!);
      let user = await User.findById(decoded.userid);
      if (user) {
        return res.json({ user: user });
      }
    }

    return res.status(500).json({ message: 'User not found!' });
  } else if (req.method === 'POST') {
    if (req.body.username) {
      const user = await User.findOne({ username: req.body.username });

      if (user) {
        bcrypt.compare(req.body.password, user.pw_hash).then(function (result: any) {
          if (result) {
            let token = jwt.sign({ userid: user?.id }, process.env.TOKEN_SECRET!);
            return res.json({ token: token, message: `Logged in as ${user?.username}.` });
          }
          return res.status(400).json({ message: 'Incorrect password!' });
        });
      }
      return res.status(500).json({ message: 'User not found!' });
    }

    return res.status(400).json({ message: 'Username is required!' });
  } else {
    return res.status(400).json({ message: 'Bad request!' });
  }
}

export default connectDB(handler);
