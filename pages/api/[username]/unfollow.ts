import type { NextApiResponse } from 'next';
import { get_user, unfollow } from '../../../helpers/user_helper';
import authenticate, { AuthRequest } from '../../../middleware/authentication';

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (req.authenticated && req.user) {
      const user_obj = await get_user({ username: <string>req.query.username });
      if (user_obj && user_obj._id && req.user._id) {
        await unfollow(req.user._id, user_obj._id);
        return res.status(200).json({});
      } else {
        return res.status(500).json('Internal Server Error');
      }
    }
  } else {
    return res.status(400).json('Bad Request');
  }
};

export default authenticate(handler);
