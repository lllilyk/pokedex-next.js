import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db';
import Pokemon from '../../models/Pokemon';
import { fetchPokemonDetails } from '../../lib/pokemonApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: '허용되지 않은 Method입니다.' });
    }

    const { pokemonId } = req.body;

    try {
        await dbConnect();
        console.log('DB 연결 성공');
        
        // PokeAPI에서 데이터 가져오기
        const rawData = await fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        
        // 데이터 구조 변환
        const pokemonData = {
            pokemonId: rawData.id,
            name: rawData.name,
            koreanName: rawData.koreanName,
            genus: rawData.genus,
            sprites: {
                front_default: rawData.sprites.front_default
            },
            types: rawData.types.map(type => ({
                name: type.type.name
            })),
            stats: rawData.stats.map(stat => ({
                stat: {
                    name: stat.stat.name
                },
                base_stat: stat.base_stat.toString()
            }))
        };

        console.log('변환된 데이터:', pokemonData);
        
        // 기존 데이터 삭제
        await Pokemon.findOneAndDelete({ pokemonId });
        console.log('기존 데이터 삭제 완료');
        
        // 새로운 데이터 저장
        const pokemon = await Pokemon.create(pokemonData);
        console.log('새 데이터 생성 완료:', pokemon);
        
        res.status(201).json(pokemon);
    } catch (error) {
        console.error('복구 실패 상세 에러:', error);
        res.status(500).json({ error: '포켓몬 데이터 복구 실패' });
    }
}