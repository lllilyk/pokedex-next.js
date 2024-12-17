export interface Pokemon {
    pokemonId: number;
    name: string;
    koreanName: string;
    sprites: {
        front_default: string;
    };
    viewCount: number;
}

export interface BookmarkPokemon {
    pokemonId: number;
    name: string;
    koreanName: string;
    sprites: {
        front_default: string;
    };
}

export interface PokemonDetail {
    pokemonId: number;
    name: string;
    koreanName: string;
    genus: string;
    sprites: {
        front_default: string;
    };
    types: {
        name: string;
        _id: string;
    }[];
    stats: {
        stat: {
            name: string;
        };
        base_stat: string;
        _id: string;
    }[];
    viewCount: number;
}