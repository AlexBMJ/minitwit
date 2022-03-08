import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {TUser} from '../models/User.scheme';
import setLatest from "../helpers/latest_helper";
import client from 'prom-client';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const MiniTwitRoute = async (handler: NextApiHandler, ...routes: string[]) => async (req: AuthRequest, res: NextApiResponse) => {
  if (!routes.includes(req.method!)) {
    return res.status(405).json({ message: 'Method not accepted!' });
  }

  setLatest(req);

  const gauge = new client.Gauge({
    name: 'metric_name',
    help: 'metric_help',
  });
  gauge.setToCurrentTime();

  const end = gauge.startTimer();
  const result = await handler(req, res);  
  end();

  return result;
};

export default MiniTwitRoute;
