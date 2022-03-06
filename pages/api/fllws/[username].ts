import type { NextApiRequest, NextApiResponse } from 'next';
import setlatest from '../../../helpers/latest_helper';
import { follow, get_user, isfollowing, unfollow } from '../../../helpers/user_helper';
import authenticate, { AuthRequest } from '../../../middleware/authentication';
import MiniTwitRoute from "../../../middleware/MiniTwitRoute";

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  const user = await get_user({ username: <string>req.query.username });

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  if (req.method === 'POST') {
    setlatest(req);
    if (req.body.follow || req.body.unfollow) {
      const to_follow = await get_user({ username: <string>req.body.follow || <string>req.body.unfollow });
      if (user && user._id && to_follow && to_follow._id) {
        if (req.authenticated && req.user && (req.user.username == user.username || req.user.admin)) {
          req.body.follow ? await follow(user._id, to_follow._id) : await unfollow(user._id, to_follow._id);
          return res.status(204).send('');
        } else {
          return res.status(403).json({ message: 'Unauthorized' });
        }
      }
    }
  }
  else if (req.method === 'GET') {
    setlatest(req);
    if (req.query.isfollowing) {
      const is_following = await get_user({ username: <string>req.query.isfollowing });
      if (user && user._id && is_following && is_following._id) {
        if (req.authenticated && req.user && (req.user.username == user.username || req.user.admin)) {
          let follow_status = await isfollowing(user._id, is_following._id);
          return res.status(200).json({ user: is_following.username, isfollowing: follow_status });
        } else {
          return res.status(403).json({ message: 'Unauthorized' });
        }
      }
    }
  }
};

export default MiniTwitRoute(authenticate(handler), 'GET', 'POST');
