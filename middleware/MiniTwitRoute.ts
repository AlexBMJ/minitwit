import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {TUser} from '../models/User.scheme';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const MiniTwitRoute = (handler: NextApiHandler, ...routes: string[]) => async (req: AuthRequest, res: NextApiResponse) => {
  if (!routes.includes(req.method!)) {
    return res.status(405).json({ message: 'Method not accepted!' });
  }

  return handler(req, res);
};

export default MiniTwitRoute;
