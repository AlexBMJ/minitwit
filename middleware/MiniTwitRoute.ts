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

    let url2 = req.url || '';

    if (req.query.username) {
      const match = url2.match(/^\/api\/(?:latest|login|msgs|register|fllws)/);

      if (match) {
        url2 = match[0];
      }
      //url2 = url2.replaceAll(encodeURIComponent(req.query.username.toString()), '');
    }

    let url = `minitwit${urlParse(url2, false).pathname.replaceAll('/', '_')}`;

    console.log(url);

    const foundMetric: any =
      (await client.register.getMetricsAsArray()).find((v) => v.name === url) ||
      new client.Gauge({
        name: url!,
        help: `Speed for ${urlParse(url2, false)}`,
      });

    foundMetric.setToCurrentTime();

    const end = foundMetric.startTimer();
    const result = handler(req, res);
    end();

    return result;
  };

export default MiniTwitRoute;
