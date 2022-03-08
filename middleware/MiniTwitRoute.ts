import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {TUser} from '../models/User.scheme';
import setLatest from "../helpers/latest_helper";
import client from 'prom-client';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}


const guages: client.Gauge<string>[] = [];

const MiniTwitRoute = (handler: NextApiHandler, ...routes: string[]) => async (req: AuthRequest, res: NextApiResponse) => {
  if (!routes.includes(req.method!)) {
    return res.status(405).json({ message: 'Method not accepted!' });
  }

  setLatest(req);

  let gauge = guages.find((v) => v.labels.name === req.url!);

  console.log(req.url);

  if (!gauge) {
    gauge = new client.Gauge({
      name: req.url!.replace("/", "_"),
      help: `Speed for ${req.url}`
    });
    guages.push(gauge);
  }

  gauge.setToCurrentTime();

  const end = gauge.startTimer();
  const result = handler(req, res);  
  end();

  return result;
};

export default MiniTwitRoute;
