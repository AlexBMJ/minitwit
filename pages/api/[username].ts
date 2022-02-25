import type {NextApiRequest, NextApiResponse} from 'next';
import {get_user} from '../../helpers/user_helper';
import Message from '../../models/Message.schema';
import MiniTwitRoute from "../../helpers/api_helper";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.query.username) {
        return res.status(400).json({message: 'No username!'});
    }

    const user_obj = await get_user({username: <string>req.query.username});

    if (!(user_obj && user_obj._id && user_obj.username && user_obj.email)) {
        return res.status(404).json({});
    }

    let messages = await Message.find({author_id: user_obj._id});
    return res.status(200).json({
        username: user_obj.username,
        email: user_obj.email,
        messages: messages,
    });
};

export default MiniTwitRoute(handler, 'GET');
