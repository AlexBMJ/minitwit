import {NextApiHandler, NextApiResponse} from "next";
import {AuthRequest} from "../middleware/authentication";

const MiniTwitRoute = (handler: NextApiHandler, ...methods: string[]) => async (req: AuthRequest, res: NextApiResponse) => {
    if (methods.indexOf(req.method!) === null) {
        return res.status(404).json('Bad Request');
    }

    return handler(req, res);
}

export default MiniTwitRoute;