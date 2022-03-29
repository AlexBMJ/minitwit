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
    // logger.info(
    //   {
    //     method: req.method,
    //     url: req.url,
    //     endpoint: endpoint,
    //     body: req.body,
    //     query: req.query,
    //   },
    //   `Received request: [${req.method}] ${req.url}`
    // );

    if (routes && routes.length > 0 && !routes.includes(req.method!)) {
      // logger.info(
      //   {
      //     method: req.method,
      //     url: req.url,
      //     endpoint,
      //     body: req.body,
      //     query: req.query,
      //   },
      //   `Unaccepted method received for: [${req.method}] ${req.url}`
      // );

      return res.status(405).json({ message: 'Method not accepted!' });
    }

    setLatest(req);

    const foundMetric: any = await httpRequestDurationMilliseconds();
    const timer = foundMetric.startTimer();

    let result;

    try {
      result = await handler(req, res);
      // logger.info(
      //   {
      //     method: req.method,
      //     url: req.url,
      //     endpoint,
      //     body: req.body,
      //     query: req.query,
      //   },
      //   `Handler executed successfully for ${endpoint}`
      // );
    } catch (ex) {
      // logger.error(
      //   {
      //     method: req.method,
      //     url: req.url,
      //     endpoint,
      //     body: req.body,
      //     query: req.query,
      //   },
      //   `Exception received for handler: ${ex}`
      // );
    }

    timer({ route: endpoint, method: req.method, status_code: res.statusCode });
    return result;
  };

export default MiniTwitRoute;
