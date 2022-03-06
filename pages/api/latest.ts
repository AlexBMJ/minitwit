import type { NextApiRequest, NextApiResponse } from 'next';
import setlatest from '../../helpers/latest_helper';
import MiniTwitRoute from "../../middleware/MiniTwitRoute";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  setlatest(req);
  return res.status(200).json({ latest: global.latest });
};

export default MiniTwitRoute(handler, 'GET');
