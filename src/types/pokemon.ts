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