// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import drive from "../../../src/storage/driveAPI";

type Data = {
  files: any;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "GET":
      async (res: NextApiResponse) => await drive.listFiles(res);
      break;
    default:
      res.setHeader("allow", ["GET"]).status(405).end();
  }
}
