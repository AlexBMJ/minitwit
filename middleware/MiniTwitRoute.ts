import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { TUser } from '../models/User.scheme';
import setLatest from '../helpers/latest_helper';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const MiniTwitRoute =
  (handler: NextApiHandler, routes: string[], endpoint: string) => async (req: AuthRequest, res: NextApiResponse) => {
    if (!routes.includes(req.method!)) {
      return res.status(405).json({ message: 'Method not accepted!' });
    }
    setLatest(req);
    console.log('AOWUIDHAIOWUDH');
    console.log(global.metrics);

    const timer = global.metrics.httpRequestDurationMilliseconds.startTimer({ route: endpoint, path: req.url });
    const result = handler(req, res);
    global.metrics.httpRequestDurationMilliseconds.labels({ status_code: res.statusCode });
    timer();
    return result;
  };

export default MiniTwitRoute;
