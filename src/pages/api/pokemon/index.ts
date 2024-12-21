import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Pokemon from '../../../models/Pokemon';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            try {
                const { search = "", page = "1", limit = "20" } = req.query;
                const searchQuery = decodeURIComponent((search as string).trim().toLocaleLowerCase());
                const currentPage = parseInt(page as string, 10);
                const limitNum = parseInt(limit as string, 10);
                const skip = (currentPage - 1) * limitNum;

                // 검색 쿼리: MongoDB $or 연산자 사용
                const query = searchQuery ? {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { koreanName: { $regex: searchQuery, $options: 'i' } },
                        { pokemonId: searchQuery.match(/^\d+$/) ? parseInt(searchQuery) : null }
                    ].filter(condition => condition.pokemonId !== null)
                } : {};

                // 전체 문서 수 계산
                const total = await Pokemon.countDocuments(query);

                // 정렬, 페이지네이션이 적용된 쿼리 실행
                const pokemons = await Pokemon.find(query)
                    .sort({ pokemonId: 1 })
                    .skip(skip)
                    .limit(limitNum);

                res.status(200).json({
                    pokemons,
                    totalPages: Math.ceil(total / limitNum),
                    currentPage
                });
            } catch (error) {
                res.status(500).json({ error: '포켓몬 fetch 실패' });
            }
            break;
        case 'POST':
            try {
                const pokemon = await Pokemon.create(req.body);
                res.status(201).json(pokemon);
            } catch (error) {
                res.status(500).json({ error: '포켓몬 create 실패' });
            }
            break;
        
        default:
            res.status(405).json({ error: '허용되지 않은 Method입니다.' });
    }
}