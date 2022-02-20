import type { NextApiRequest, NextApiResponse } from 'next';
import { follow, get_user, isfollowing } from '../../../helpers/user_helper';
import { verify } from 'jsonwebtoken';
import { Token } from '../../../types/jwt';
import { Types } from 'mongoose';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    if (req.headers.authorization) {
      const splittedAuth = req.headers.authorization.split(' ');

      if (splittedAuth.length === 2) {
        let token = <Token>verify(req.headers.authorization.split(' ')[1], process.env.TOKEN_SECRET!);

        if (token.userid) {
          const user_obj = await get_user({ username: <string>req.query.username });
          if (user_obj && user_obj._id) {
            let follow_status = await isfollowing(new Types.ObjectId(token.userid), user_obj._id);
            return res.status(200).json({ user: user_obj.username, isfollowing: follow_status });
          }
          return res.status(404).json('User not found');
        }
        return res.status(401).json('Unauthorized');
      }
      return res.status(400).json('Bad request');
    }
    return res.status(401).json('Unauthorized');
  }
  return res.status(400).json('Bad request');
};

export default handler;
