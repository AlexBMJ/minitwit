import { NextApiRequest, NextApiResponse } from 'next';
import { register, collectDefaultMetrics } from 'prom-client';
import MiniTwitRoute from '../../middleware/MiniTwitRoute';

if (!global.metric_init) {
  collectDefaultMetrics({ prefix: 'minitwit_' });
  global.metric_init = true;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', register.contentType);
  return res.send(await register.metrics());
}

export default MiniTwitRoute(handler, ['GET'], 'api_metrics');
