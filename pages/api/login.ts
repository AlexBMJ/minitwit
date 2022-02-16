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
      const splittedAuth = req.headers.authorization?.split(' ');

      if (splittedAuth.length === 2) {
        var decoded = <Token>jwt.verify(splittedAuth[1], process.env.TOKEN_SECRET!);
        let user = await User.findById(decoded.userid);
        if (user) {
          return res.status(200).json({ user: user });
        } else {
          return res.status(401).json({ message: 'No USER' });
        }
      } else {
        return res.status(401).json({ message: 'No JWT' });
      }
    } else {
      return res.status(500).json({ message: 'User not found!' });
    }
  } else if (req.method === 'POST') {
    if (req.body.username && req.body.password) {
      const user = await User.findOne({ username: req.body.username });

      if (user) {
        try {
          const result = await bcrypt.compare(req.body.password, user.pw_hash);

          if (result) {
            let token = jwt.sign({ userid: user?.id }, process.env.TOKEN_SECRET!);
            return res.status(200).json({ token: token, message: `Logged in as ${user?.username}.` });
          } else {
            return res.status(400).json({ message: 'Incorrect password!' });
          }
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error comparing!' });
        }
      } else {
        return res.status(500).json({ message: 'User not found!' });
      }
    } else {
      return res.status(400).json({ message: 'Username is required!' });
    }
  } else {
    return res.status(400).json({ message: 'Bad request!' });
  }
}

export default connectDB(handler);
