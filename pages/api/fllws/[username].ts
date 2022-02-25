import type {NextApiResponse} from 'next';
import {follow, getUser, isFollowing, unfollow} from '../../../helpers/user_helper';
import authenticate, {AuthRequest} from '../../../middleware/authentication';
import MiniTwitRoute from "../../../helpers/api_helper";

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  const user = await getUser({username: <string>req.query.username});

  if (req.method === 'POST') {
    if (!(req.body.follow || req.body.unfollow)) {
      return res.status(404).json('Bad Request');
    }

    const to_follow = await getUser({username: <string>req.body.follow || <string>req.body.unfollow});

    if (!(user && to_follow)) {
      return res.status(404).json('Bad Request');
    }

    if (!(req.authenticated && req.user && (req.user.username == user.username || req.user.admin))) {
      return res.status(403).json({message: 'Unauthorized'});
    }

    if (!(user._id && to_follow._id)) {
      return res.status(404).json('User not found');
    }

    req.body.follow ? await follow(user._id, to_follow._id) : await unfollow(user._id, to_follow._id);
    return res.status(204).send('');
  }

  if (req.method === 'GET') {
    if (!req.query.isfollowing) {
      return res.status(404).json('Bad Request');
    }

    const is_following = await getUser({username: <string>req.query.isfollowing});

    if (!(user && is_following)) {
      return res.status(404).json('Bad Request');
    }

    if (!(req.authenticated && req.user && (req.user.username == user.username || req.user.admin))) {
      return res.status(403).json({message: 'Unauthorized'});
    }

    if (user._id && is_following._id) {
      let follow_status = await isFollowing(user._id, is_following._id);
      return res.status(200).json({user: is_following.username, isfollowing: follow_status});
    }

    return res.status(404).json('User not found');
  }
};

export default MiniTwitRoute(authenticate(handler), 'GET', 'POST');
