import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/db";
import Pokemon from "../../../models/Pokemon";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    await dbConnect();

    switch (req.method) {
        case 'GET':
            try {
                const { skipViewCount } = req.query;
                
                let pokemon;
                if (skipViewCount === 'true') {
                    // skipViewCount가 true면 조회수 증가 없이 조회만
                    pokemon = await Pokemon.findOne({ pokemonId: Number(id) });
                } else {
                    // 일반 조회 시 조회수 증가
                    pokemon = await Pokemon.findOneAndUpdate(
                        { pokemonId: Number(id) },
                        { $inc: { viewCount: 1} },
                        { new: true }
                    );
                }

                if (!pokemon) {
                    return res.status(404).json({ error: 'Pokemon을 발견하지 못했습니다.' });
                }
                res.status(200).json(pokemon);
            } catch (error) {
                console.error('조회수 업데이트 실패: ', error);
                res.status(500).json({ error: '포켓몬 Fetch 실패' });
            }
            break;
        
        case 'PUT':
            try {
                const pokemon = await Pokemon.findOneAndUpdate(
                    { pokemonId: Number(id) },
                    req.body,
                    { new: true, runValidators: true }
                );
                if (!pokemon) {
                    return res.status(404).json({ error: 'Pokemon을 발견하지 못했습니다.' });
                }
                res.status(200).json(pokemon);
            } catch (error) {
                res.status(500).json({ error: '포켓몬 Update 실패' });
            }
            break;

        case 'DELETE':
            try {
                const pokemon = await Pokemon.findOneAndDelete({ pokemonId: Number(id) });
                if (!pokemon) {
                    return res.status(404).json({ error: 'Pokemon을 발견하지 못했습니다. '});
                }
                res.status(204).end();
            } catch (error) {
                res.status(500).json({ error: '포켓몬 Delete 실패' });
            }
            break;

        default:
            res.status(405).json({ error: '허용되지 않은 Method입니다.' });
    }
}