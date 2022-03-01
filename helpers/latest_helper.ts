import { NextApiRequest } from 'next';
import { AuthRequest } from '../middleware/authentication';

export default function setlatest(req: NextApiRequest | AuthRequest) {
  let latest = <string>req.query.latest;
  const numberLatest = Number(latest);
  if (!isNaN(numberLatest)) {
    global.latest = numberLatest;
  }
}
