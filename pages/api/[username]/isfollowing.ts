import type { NextApiResponse } from 'next';
import { get_user, isfollowing } from '../../../helpers/user_helper';
import authenticate, { AuthRequest } from '../../../middleware/authentication';

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    if (req.authenticated && req.user) {
      const user_obj = await get_user({ username: <string>req.query.username });
      if (user_obj && user_obj._id && req.user._id) {
        let follow_status = await isfollowing(req.user._id, user_obj._id);
        return res.status(200).json({ user: user_obj.username, isfollowing: follow_status });
      }
      return res.status(404).json('User not found');
    }
  }
  return res.status(400).json('Bad request');
};

export default authenticate(handler);
