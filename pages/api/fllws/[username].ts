import type { NextApiRequest, NextApiResponse } from 'next';
import { follow, get_user, unfollow } from '../../../helpers/user_helper';
import authenticate, { AuthRequest } from '../../../middleware/authentication';

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const user = await get_user({ username: <string>req.query.username });
    if (req.body.follow || req.body.unfollow) {
      const to_follow = await get_user({ username: <string>req.body.follow || <string>req.body.unfollow });
      if (user && to_follow) {
        if (req.authenticated && req.user && (req.user.username == user.username || req.user.admin)) {
          if (user._id && to_follow._id) {
            req.body.follow ? await follow(user._id, to_follow._id) : await unfollow(user._id, to_follow._id);
            return res.status(204).send('');
          }
        }
      }
    }
  }
  return res.status(404).json('Bad Request');
};

export default authenticate(handler);
