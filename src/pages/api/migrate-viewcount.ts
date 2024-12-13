import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db';
import Pokemon from '../../models/Pokemon';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '허용되지 않은 Method입니다.' });
    }

    try {
        await dbConnect();
        
        // viewCount 필드가 없는 모든 포켓몬을 찾아서 0으로 초기화
        const result = await Pokemon.updateMany(
            { viewCount: { $exists: false } },
            { $set: { viewCount: 0 } }
        );

        res.status(200).json({ 
            message: '마이그레이션 완료',
            modified: result.modifiedCount 
        });
    } catch (error) {
        console.error('마이그레이션 실패:', error);
        res.status(500).json({ error: '마이그레이션 실패' });
    }
}