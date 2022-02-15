// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../middleware/mongodb';
import User, { TUser } from '../../models/User.scheme';

var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        var decoded = jwt.verify(req.headers.authorization?.split(" ")[1], process.env.tokensecret)
        let user = await User.findOne({ id: decoded.id })
        if (!user) return res.status(500).json({ message: 'User not found!' })
        return res.json({ user: user })
    }
    else if (req.method === 'POST') {
        if (!req.body.username) return res.status(400).json({ message: 'Username is required!' })

        let user = await User.findOne({ username: req.body.username })
        if (!user) return res.status(500).json({ message: 'User not found!' })

        bcrypt.compare(req.body.password, user.pw_hash).then(function(result : any) {
            if (result) {
                let token = jwt.sign({ userid: user?.id }, process.env.tokensecret)
                return res.json({ token: token, message: `Logged in as ${user?.username}.` })
            }
            return res.status(400).json({ message: 'Incorrect password!' })
        });
    }
    else {
        return res.status(400).json({ message: 'Bad request!' })
    }
}

export default connectDB(handler);
