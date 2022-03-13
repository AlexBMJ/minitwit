import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { TUser } from '../models/User.scheme';
import setLatest from '../helpers/latest_helper';
import client, { Gauge } from 'prom-client';
import urlParse from 'url-parse';

export interface AuthRequest extends NextApiRequest {
  user?: TUser;
  authenticated?: boolean;
}

const MiniTwitRoute =
  (handler: NextApiHandler, ...routes: string[]) =>
  async (req: AuthRequest, res: NextApiResponse) => {
    if (!routes.includes(req.method!)) {
      return res.status(405).json({ message: 'Method not accepted!' });
    }

    setLatest(req);

    let url = req.url || '';
    console.log(url);
    const match = url.match(/^\/api\/(?:latest|login|msgs|register|fllws)/);
    if (match) {
      url = match[0];
    }
    let endpoint = `minitwit${url.replaceAll('/', '_')}`;
    console.log(endpoint);

    const foundMetric: any =
      (await client.register.getMetricsAsArray()).find((v) => v.name === endpoint) ||
      new client.Gauge({
        name: endpoint,
        help: `Speed for ${endpoint}`,
      });

    foundMetric.setToCurrentTime();

    const end = foundMetric.startTimer();
    const result = handler(req, res);
    end();

    return result;
  };

export default MiniTwitRoute;
