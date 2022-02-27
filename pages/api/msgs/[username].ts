import type {NextApiResponse} from 'next';
import Message from '../../../models/Message.schema';
import authenticate, {AuthRequest} from '../../../middleware/authentication';
import {getUser} from '../../../helpers/user_helper';
import MiniTwitRoute from "../../../helpers/api_helper";

const handler = async (req: AuthRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const username = <string>req.query.username;
    const amount = <string>req.query.no;
    const numberAmount = Number(amount);

    if (!isNaN(numberAmount)) {
      const recentMessages = await Message.find({author_name: username}).limit(numberAmount).sort({pub_date: -1}).exec();
      return res.status(200).json({messages: recentMessages});
    }

    return res.status(400).json({message: 'Not a number...'});
  }

  if (req.method === 'POST') {
    const username = <string>req.query.username;

    if (!req.body.content) {
      return res.status(400).json({message: 'Missing data'});
    }

    if (!(req.authenticated && req.user && (req.user.username == username || req.user.admin))) {
      return res.status(403).json({message: 'Unauthorized'});
    }

    let user = await await getUser({username: username.toLowerCase()});

    if (!user) {
      return res.status(404).json({message: 'No USER'});
    }

    await new Message({
      author_id: user._id,
      flagged: false,
      pub_date: new Date(),
      text: req.body.content,
      author_name: user.username,
    }).save();
    return res.status(204).send('');
  }
};

export default MiniTwitRoute(authenticate(handler), 'GET', 'POST');
