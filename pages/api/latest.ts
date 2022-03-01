import type { NextApiRequest, NextApiResponse } from 'next';
import setlatest from '../../helpers/latest_helper';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    setlatest(req);
    return res.status(200).json({ latest: global.latest });
  } else {
    return res.status(400).json({ message: 'Method not supported!' });
  }
};

export default handler;
