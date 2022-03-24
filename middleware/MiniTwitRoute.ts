import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { TUser } from '../models/User.scheme';
import setLatest from '../helpers/latest_helper';
import Prometheus, { Histogram } from 'prom-client';
import httpRequestDurationMilliseconds from '../helpers/metrics_helper';
import logger from '../app/logger';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const MiniTwitRoute =
  (handler: NextApiHandler, routes: string[], endpoint: string) => async (req: AuthRequest, res: NextApiResponse) => {
    logger.info(`Received request: [${req.method}] ${req.url}`, {test: 'hello'});

    if (!routes.includes(req.method!)) {
      return res.status(405).json({ message: 'Method not accepted!' });
    }
    setLatest(req);

    const foundMetric: any = await httpRequestDurationMilliseconds();
    const timer = foundMetric.startTimer();
    const result = handler(req, res);
    timer({ route: endpoint, method: req.method, status_code: res.statusCode });
    return result;
  };

export default MiniTwitRoute;
