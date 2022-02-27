import { NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import User from '../../models/User.scheme';
import authenticate, { AuthRequest } from '../../middleware/authentication';
import { get_user } from '../../helpers/user_helper';

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, pwd }: { username: string; email: string; pwd: string } = req.body;

    if (username && email && pwd) {
      if (!username.includes(':')) {
        try {
          const user = await get_user({ username: username });
          if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(pwd, salt);

            await new User({
              email: email,
              pw_hash: hash,
              username: username.toLowerCase(),
            }).save();
            return res.status(204).json({});
          } else {
            return res.status(400).json({ message: 'User with that email was already found!' });
          }
        } catch (e) {
          console.log('ERROR', e);
          return res.status(500).json({});
        }
      } else {
        return res.status(400).json({ message: 'Username cannot contain the colon character' });
      }
    } else {
      return res.status(400).json({ message: 'Username, email and password must be set!' });
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
