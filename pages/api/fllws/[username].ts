import type { NextApiResponse } from 'next';
import { follow, getUser, isFollowing, unfollow } from '../../../helpers/user_helper';
import authenticate, { AuthRequest } from '../../../middleware/authentication';
import MiniTwitRoute from "../../../middleware/MiniTwitRoute";

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  const user = await getUser({ username: <string>req.query.username });

  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  if (!(req.authenticated && req.user && (req.user.username == user.username || req.user.admin))) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    if (req.body.follow || req.body.unfollow) {
      const to_follow = await getUser({ username: <string>req.body.follow || <string>req.body.unfollow });
      if (user._id && to_follow && to_follow._id) {
          req.body.follow ? await follow(user._id, to_follow._id) : await unfollow(user._id, to_follow._id);
          return res.status(204).send('');
      }
    }
  }
  else if (req.method === 'GET') {
    if (req.query.isfollowing) {
      const is_following = await getUser({ username: <string>req.query.isfollowing });
      if (user._id && is_following && is_following._id) {
        let follow_status = await isFollowing(user._id, is_following._id);
        return res.status(200).json({ user: is_following.username, isfollowing: follow_status });
      }
    }
  }

  return res.status(400).json({message: 'Bad request'});
};

export default MiniTwitRoute(authenticate(handler), ['GET', 'POST'], 'api/fllws/username');
