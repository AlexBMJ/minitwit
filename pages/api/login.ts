// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authenticate, { AuthRequest } from '../../middleware/authentication';

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    if (req.authenticated) {
      return res.status(200).json({ user: req.user });
    }
    return res.status(401).json('Unauthorized');
  } else if (req.method === 'POST') {
    if (req.authenticated && req.user) {
      let token = jwt.sign({ userid: req.user?._id?.toString() }, process.env.TOKEN_SECRET!);
      return res.status(200).json({ token: token, message: `Logged in as ${req.user?.username}.` });
    } else {
      return res.status(400).json({ message: 'Incorrect username or password!' });
    }
  } else {
    return res.status(400).json({ message: 'Bad request!' });
  }
}

export default authenticate(handler);
