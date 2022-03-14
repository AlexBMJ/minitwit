import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';
import {TUser} from '../models/User.scheme';
import setLatest from '../helpers/latest_helper';
import client from 'prom-client';

export interface AuthRequest extends NextApiRequest {
    user?: TUser;
    authenticated?: boolean;
}

const MiniTwitRoute = (handler: NextApiHandler, routes: string[], path = '') => async (req: AuthRequest, res: NextApiResponse) => {
    if (!routes.includes(req.method!)) {
        return res.status(405).json({message: 'Method not accepted!'});
    }

    setLatest(req);

    let endpoint = path === '' ? req.url! : path;
    endpoint = endpoint.replace('/', '_');

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
