import type { NextApiResponse } from 'next';
import * as jwt from 'jsonwebtoken';
import authenticate, { AuthRequest } from '../../middleware/authentication';
import MiniTwitRoute from '../../middleware/MiniTwitRoute';

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (req.authenticated) {
      return res.status(200).json({ user: req.user });
    }

    return res.status(403).json('Unauthorized');
  }

  // POST
  if (req.authenticated && req.user) {
    const token = jwt.sign({ userid: req.user._id?.toString() }, process.env.TOKEN_SECRET!);
    return res.status(200).json({ token: token, message: `Logged in as ${req.user?.username.toLowerCase()}.` });
  }

  return res.status(400).json({ message: 'Incorrect username or password!' });
}

export default MiniTwitRoute(authenticate(handler), ['GET', 'POST'], 'api_login');
