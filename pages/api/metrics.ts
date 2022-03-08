import { NextApiRequest, NextApiResponse } from "next";
import { register, collectDefaultMetrics } from "prom-client";
import MiniTwitRoute from "../../middleware/MiniTwitRoute";

collectDefaultMetrics({ prefix: "minitwit_" });

async function handler(req: NextApiRequest, res: NextApiResponse) {

  res.setHeader("Content-type", register.contentType);
  return res.send(register.metrics());
};

export default MiniTwitRoute(handler);