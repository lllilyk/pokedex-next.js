import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db';
import Pokemon from '../../models/Pokemon';
import { fetchPokemonDetails } from '../../lib/pokemonApi';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 환경 변수 체크 먼저 수행
    if (process.env.ENABLE_SEED_API ! == 'true') {
        return res.status(403).json({ message: '시딩 API가 비활성화되어 있습니다.'});
    }
    
    try {
        await dbConnect();
        console.log('MongoDB 연결 성공');
        
        await Pokemon.deleteMany({});
        console.log('기존 데이터 삭제 완료');
        
        const pokemons = [];
        for (let i = 1; i <= 151; i++) {
            const pokemonData = await fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${i}`);

            const formattedPokemon = {
                pokemonId: pokemonData.id,
                name: pokemonData.name,
                koreanName: pokemonData.koreanName,
                genus: pokemonData.genus,
                sprites: {
                    front_default: pokemonData.sprites.front_default
                },
                types: pokemonData.types.map((type: any) => ({
                    name: type.type.name
                })),
                stats: pokemonData.stats.map((stat: any) => ({
                    stat: {
                        name: stat.stat.name
                    },
                    base_stat: stat.base_stat
                }))
            };
            //console.log('Formatted Pokemon Types:', JSON.stringify(formattedPokemon.types, null, 2));

            pokemons.push(formattedPokemon);
            console.log(`${i}번 포켓몬 데이터 가져오기 완료`);
        }
        
        await Pokemon.insertMany(pokemons);
        console.log('MongoDB에 데이터 저장 완료');
        
        res.status(200).json({ message: '데이터베이스 시딩 완료!' });
    } catch (error) {
        console.error('시딩 중 에러 발생:', error);
        res.status(500).json({ error: '데이터베이스 시딩 실패' });
    }
}