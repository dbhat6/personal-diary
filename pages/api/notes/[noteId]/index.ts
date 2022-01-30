import type { NextApiRequest, NextApiResponse } from 'next'
import { getPost } from '../../../../src/handlers/notetHandler'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    let { noteId } = req.query
    switch (req.method) {
        case "GET": {
            let data = getPost(noteId)
            data = data.filter(data => data)
            res.status(200).json(data)
            break;
        }
        default: res.setHeader("allow", ["GET"]).status(405).end();
    }
}
