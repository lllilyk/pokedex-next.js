import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db';
import Pokemon from '../../../models/Pokemon';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    switch (req.method) {
        case 'GET':
            try {
                const pokemons = await Pokemon.find({});
                res.status(200).json(pokemons);
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