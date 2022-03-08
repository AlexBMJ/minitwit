import { NextApiRequest, NextApiResponse } from "next";
import { register, collectDefaultMetrics } from "prom-client";

collectDefaultMetrics({ prefix: "minitwit_" });

async function handler(req: NextApiRequest, res: NextApiResponse) {

  res.setHeader("Content-type", register.contentType);
  res.send(register.metrics());
};

export default handler;