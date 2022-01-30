// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUnixTime } from 'date-fns'
import fs from 'fs'
import path from 'path'

import { Note } from "../../../src/classes/Note";
// https://www.youtube.com/watch?v=Z2MCxblgPoc
import { getDetails, createPost } from '../../../src/handlers/notetHandler';
import drive from '../../../src/storage/driveAPI';

type Data = {
  files: Object
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  switch (req.method) {
    case "GET": async (res: NextApiResponse) => await drive.listFiles(res)
      break;
    default: res.setHeader("allow", ["GET"]).status(405).end();
  }
}
