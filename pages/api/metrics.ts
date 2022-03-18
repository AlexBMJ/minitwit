import { NextApiRequest, NextApiResponse } from 'next';
import { register, collectDefaultMetrics } from 'prom-client';
import httpRequestDurationMilliseconds from '../../helpers/metrics_helper';
import metrics_helper from '../../helpers/metrics_helper';
import MiniTwitRoute from '../../middleware/MiniTwitRoute';

if (!global.initialized) {
  collectDefaultMetrics({ prefix: 'minitwit_' });
  global.initialized = true;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', register.contentType);
  return res.send(await register.metrics());
}

export default MiniTwitRoute(handler, ['GET'], 'api_metrics');
