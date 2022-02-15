import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../middleware/mongodb';
import bcrypt from 'bcryptjs';
import { Token } from '../../types/jwt';
import * as jwt from 'jsonwebtoken';
import User from '../../models/User.scheme';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (username && email && password) {
      const user = await User.findOne({ email: email });
      if (!user) {
        bcrypt.genSalt(10, async function (err, salt) {
          if (!err) {
            bcrypt.hash(password, salt, async function (err, hash) {
              if (!err) {
                const newUser = await new User({ email: email, pw_hash: hash, username: username }).save();
                let token = jwt.sign({ userid: newUser.id }, process.env.TOKEN_SECRET!);
                return res.status(200).json({ token: token, message: `Logged in as ${newUser.username}.` });
              } else {
                console.log(err);
                return res.status(500).json({ message: 'We could not generate a hash!' });
              }
            });
          } else {
            console.log(err);
            return res.status(500).json({ message: 'We could not generate a salt!' });
          }
        });
      } else {
        return res.status(400).json({ message: 'User with that email was already found!' });
      }
    } else {
      return res.status(400).json({ message: 'Username, email and password must be set!' });
    }
  } else if (req.method === 'GET') {
    if (req.headers.authorization) {
      var decoded = <Token>jwt.verify(req.headers.authorization?.split(' ')[1], process.env.TOKEN_SECRET!);
      let user = await User.findById(decoded.userid);

      if (user) {
        return res.json({ user: user });
      }
      return res.status(500).json({ message: 'User not found!' });
    }
    return res.status(400).json({ message: 'No headers' });
  } else {
    return res.status(400).json({ message: 'Method not accepted!' });
  }
}

export default connectDB(handler);