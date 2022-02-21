import { NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import User from '../../models/User.scheme';
import authenticate, { AuthRequest } from '../../middleware/authentication';

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, pwd }: { username: string; email: string; pwd: string } = req.body;
    console.log(req.body);
    if (!username.includes(':')) {
      if (username && email && pwd) {
        try {
          const user = await User.findOne({ email: email });
          console.log(user);
          if (!user) {
            bcrypt.genSalt(10, async function (err, salt) {
              if (!err) {
                bcrypt.hash(pwd, salt, async function (err, hash) {
                  if (!err) {
                    const newUser = await new User({
                      email: email,
                      pw_hash: hash,
                      username: username.toLowerCase(),
                    }).save();
                    return res.status(204).end();
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
        } catch (e) {
          console.log(e);
          return res.status(500).json({});
        }
      } else {
        return res.status(400).json({ message: 'Username, email and password must be set!' });
      }
    } else {
      return res.status(400).json({ message: 'Username cannot contain the colon character' });
    }
  } else if (req.method === 'GET') {
    if (req.authenticated) {
      return res.status(200).json({ user: req.user });
    }
    return res.status(403).json('Unauthorized');
  } else {
    return res.status(400).json({ message: 'Method not accepted!' });
  }
}

export default authenticate(handler);
