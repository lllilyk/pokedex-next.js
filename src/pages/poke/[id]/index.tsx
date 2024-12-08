import React from "react";
import { GetServerSideProps } from "next";
import { fetchPokemonDetails } from "../../../lib/pokemonApi";
import styles from "../../../styles/PokemonDetail.module.css";

interface PokemonDetailProps {
    pokemon: {
        id: number;
        name: string;
        koreanName: string;
        genus: string;
        sprites: {
            front_default: string;
        };
        types: { type: { name: string } }[];
        stats: { stat: { name: string }; base_stat: number }[];
    };
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };
    // return {notFound: true}
    const pokemon = await fetchPokemonDetails(`https://pokeapi.co/api/v2/pokemon/${id}`);

    return {
        props: {
            pokemon,
        },
    };
};

const PokemonDetail = ({ pokemon }: PokemonDetailProps): React.JSX.Element => {
    return (
        <div className={styles.container}>
            <h3>#{pokemon.id}</h3>
            <h1>{pokemon.koreanName} ({pokemon.name})</h1>
            <img
                src={pokemon.sprites.front_default}
                alt={pokemon.koreanName}
            />
            <p>타입: {pokemon.types.map((type) => type.type.name).join(", ")}</p>
            <p>분류: {pokemon.genus}</p>
            <p>능력치:</p>
            <ul className={styles.stats}>
                {pokemon.stats.map((stat) => (
                    <li key={stat.stat.name}>
                        {stat.stat.name}: {stat.base_stat}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PokemonDetail;
