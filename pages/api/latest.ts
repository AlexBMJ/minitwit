import type { NextApiRequest, NextApiResponse } from 'next';
import MiniTwitRoute from '../../middleware/MiniTwitRoute';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ latest: global.latest });
};

export default MiniTwitRoute(handler, ['GET'], 'api_latest');
