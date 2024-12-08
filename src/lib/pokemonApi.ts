import apiClient from "./apiClient";

interface PokemonData {
    id: number;
    sprites: {
        front_default: string;
    };
    [key: string]: any;
}

interface SpeciesData {
    name: string;
    genera: { genus: string; language: { name: string } }[];
    names: { name: string; language: { name: string } }[];
}

// 포켓몬 상세 데이터
export const fetchPokemonDetails = async (url: string) => {
    const pokemonData: PokemonData = await apiClient.get(url);
    const speciesData = await fetchPokemonSpecies(pokemonData.id);

    return {
        ...pokemonData,
        ...speciesData,
        sprites: pokemonData.sprites,
        id: pokemonData.id,
        name: pokemonData.name,
    };
};

// 포켓몬 종 데이터
export const fetchPokemonSpecies = async (id: number) => {
    const speciesData: SpeciesData = await apiClient.get(`/pokemon-species/${id}`);
    const koreanGenus = speciesData.genera.find((genus: any) => genus.language.name === "ko")?.genus;
    const koreanName = speciesData.names.find((name: any) => name.language.name === "ko")?.name;

    return {
        genus: koreanGenus || speciesData.name,
        koreanName: koreanName || speciesData.name,
    };
};

