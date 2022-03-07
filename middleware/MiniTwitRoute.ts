import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {TUser} from '../models/User.scheme';
import setLatest from "../helpers/latest_helper";

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const MiniTwitRoute = (handler: NextApiHandler, ...routes: string[]) => async (req: AuthRequest, res: NextApiResponse) => {
  if (!routes.includes(req.method!)) {
    return res.status(405).json({ message: 'Method not accepted!' });
  }

  setLatest(req);
  return handler(req, res);
};

export default MiniTwitRoute;
