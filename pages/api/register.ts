import { NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import User from '../../models/User.scheme';
import authenticate, { AuthRequest } from '../../middleware/authentication';
import { getUser } from '../../helpers/user_helper';
import MiniTwitRoute from '../../middleware/MiniTwitRoute';

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (req.authenticated) {
      return res.status(200).json({ user: req.user });
    }

    return res.status(403).json('Unauthorized');
  }

  // POST
  const { username, email, pwd }: { username: string; email: string; pwd: string } = req.body;

  if (!(username && email && pwd)) {
    return res.status(400).json({ message: 'Username, email and password must be set!' });
  }

  if (username && username.includes(':')) {
    return res.status(400).json({ message: 'Username cannot contain the colon character' });
  }

  try {
    const user = await getUser({ username: username });

    if (user) {
      return res.status(400).json({ message: 'User with that email was already found!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pwd, salt);

    await new User({ email: email, pw_hash: hash, username: username.toLowerCase() }).save();
    return res.status(204).send('');
  } 
  catch (e) {
    console.log('ERROR', e);
    return res.status(500).json({});
  }
}

export default MiniTwitRoute(authenticate(handler), ['GET', 'POST'], 'api_register');
