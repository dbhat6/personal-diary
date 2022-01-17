import type { NextApiRequest, NextApiResponse } from 'next'
import { getPost } from '../../../../src/handlers/postHandler'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (!methodDirects[req.method]) {
        return res.setHeader("allow", Object.keys(methodDirects).join(",")).status(405).end();
    }

    let { noteId } = req.query
    console.log("got request for ", noteId);
    let data: Object[] = methodDirects[req.method](noteId)
    data = data.filter(data => data)
    res.status(200).json(data)
}

const methodDirects = {
    "GET": (noteId: string) => getPost(noteId),
}
