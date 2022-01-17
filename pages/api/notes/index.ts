// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getUnixTime } from 'date-fns'
import fs from 'fs'
import path from 'path'

import { Note } from "../../../src/classes/Note";
import { getDetails, createPost } from '../../../src/handlers/postHandler';

type Data = {
  files: Object
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!methodDirects[req.method]) {
    return res.setHeader("allow", Object.keys(methodDirects).join(",")).status(405).end();
  }

  let data = methodDirects[req.method](req.body);
  res.status(200).json({ files: data })

}

const methodDirects = {
  "GET": () => getDetails(),
  "POST": (body) => createPost(body)
}
