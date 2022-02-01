// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getDetails, createPost } from '../../../src/handlers/notetHandler';

type Data = {
  files: any
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  let data: any;
  switch (req.method) {
    case "GET": {
      data = getDetails()
      break;
    }
    case "POST": {
      data = createPost(req.body)
      break;
    }
    default: res.setHeader("allow", ["GET", "POST"]).status(405).end();
  }
  res.status(200).json({ files: data })
}
