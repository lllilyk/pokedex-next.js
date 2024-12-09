import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db";
import Bookmark from "../../../models/Bookmark";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    const userId = "tempUserId";

    switch (req.method) {
        case 'GET': 
            try {
                const bookmarks = await Bookmark.find({ userId });
                res.status(200).json(bookmarks);
            } catch (error) {
                res.status(500).json({ error: '북마크 조회 실패' });
            }
            break;

        case 'POST':
            try {
                const bookmark = await Bookmark.create({
                    ...req.body,
                    userId
                });
                res.status(200).json(bookmark);
            } catch (error) {
                res.status(500).json({ error: '북마크 생성 실패' });
            }
            break;

        case 'DELETE':
            try {
                const { pokemonId } = req.query;
                await Bookmark.deleteOne({ userId, pokemonId });
                res.status(200).json({ message: '북마크 삭제 완료' });
            } catch (error) {
                res.status(500).json({ error: '북마크 삭제 실패' });
            }
            break;
        
        default:
            res.status(405).json({ error: '허용되지 않은 Method입니다.' });
    }

}