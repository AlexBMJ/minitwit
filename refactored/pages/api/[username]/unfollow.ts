import type { NextApiRequest, NextApiResponse } from 'next';
import { unfollow, get_user } from '../../../db_helpers/user_helper';
import { verify } from 'jsonwebtoken';
import { Token } from '../../../types/jwt';
import { Types } from 'mongoose';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(400);
  }

  if (!req.headers.authorization) {
    return res.status(401);
  }

  let token = <Token>verify(req.headers.authorization.split(' ')[1], process.env.tokensecret!);

  if (!token.userid) {
    return res.status(401);
  }

  const user_obj = await get_user({ username: req.query.username[0] });

  if (user_obj && user_obj._id) {
    await unfollow(new Types.ObjectId(token.userid), user_obj._id);
    return res.status(200).json(user_obj._id);
  }

  return res.status(404);
};
