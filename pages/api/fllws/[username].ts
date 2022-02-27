import type { NextApiRequest, NextApiResponse } from 'next';
import { follow, get_user, isfollowing, unfollow } from '../../../helpers/user_helper';
import authenticate, { AuthRequest } from '../../../middleware/authentication';

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  const user = await get_user({ username: <string>req.query.username });

  if (req.method === 'POST') {
    if (req.body.follow || req.body.unfollow) {
      const to_follow = await get_user({ username: <string>req.body.follow || <string>req.body.unfollow });
      if (user && to_follow) {
        if (req.authenticated && req.user && (req.user.username == user.username || req.user.admin)) {
          if (user._id && to_follow._id) {
            req.body.follow ? await follow(user._id, to_follow._id) : await unfollow(user._id, to_follow._id);
            return res.status(204).send('');
          }
          return res.status(404).json('User not found');
        } else {
          return res.status(403).json({ message: 'Unauthorized' });
        }
      }
    }
  } else if (req.method === 'GET') {
    if (req.query.isfollowing) {
      const is_following = await get_user({ username: <string>req.query.isfollowing });
      if (user && is_following) {
        if (req.authenticated && req.user && (req.user.username == user.username || req.user.admin)) {
          if (user._id && is_following._id) {
            let follow_status = await isfollowing(user._id, is_following._id);
            return res.status(200).json({ user: is_following.username, isfollowing: follow_status });
          }
          return res.status(404).send('User not found');
        } else {
          return res.status(403).json({ message: 'Unauthorized' });
        }
      }
    }
  }
  return res.status(404).send('Bad Request');
};

export default authenticate(handler);
