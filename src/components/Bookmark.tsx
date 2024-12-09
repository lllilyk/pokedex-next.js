import React from "react";
import Link from "next/link";
import styles from "../styles/Pokedex.module.css";

interface Pokemon {
    pokemonId: number;
    name: string;
    koreanName: string;
    sprites: {
        front_default: string;
    };
}

interface BookmarkProps {
    bookmarkedPokemon: Pokemon[];
    toggleBookmark: (pokemon: Pokemon) => void;
}

const Bookmark = ({ bookmarkedPokemon, toggleBookmark }: BookmarkProps): React.JSX.Element => {
    return (
        <div className={styles.bookmarkSection}>
            <h2 className={styles.title}>북마크된 포켓몬</h2>
            <ul className={styles.pokemonGrid}>
                {bookmarkedPokemon.map((pokemon) => (
                    <li key={pokemon.pokemonId} className={styles.pokemonItem}>
                        <h3>
                            <Link href={`/poke/${pokemon.pokemonId}`}>
                                #{pokemon.pokemonId}. {pokemon.koreanName} ({pokemon.name})
                            </Link>
                        </h3>
                        <Link href={`/poke/${pokemon.pokemonId}`}>
                            <img
                                className={styles.pokemonImage}
                                src={pokemon.sprites.front_default}
                                alt={pokemon.name}
                            />
                        </Link>
                        <button
                            onClick={() => toggleBookmark(pokemon)}
                            className={`${styles.bookmarkButton} ${bookmarkedPokemon.some((p) => p.pokemonId === pokemon.pokemonId) ? styles.remove : styles.add}`}
                        >
                            {bookmarkedPokemon.some((p) => p.pokemonId === pokemon.pokemonId) ? "북마크 제거" : "북마크"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Bookmark;