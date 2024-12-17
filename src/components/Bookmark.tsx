import React from "react";
import Link from "next/link";
import styles from "../styles/Pokedex.module.css";
import { BookmarkPokemon } from "../types/pokemon";
import { BookmarkMinus } from "lucide-react";

interface BookmarkProps {
    bookmarkedPokemon: BookmarkPokemon[];
    toggleBookmark: (pokemon: BookmarkPokemon) => Promise<void>;
}

const Bookmark = ({ bookmarkedPokemon, toggleBookmark }: BookmarkProps): React.JSX.Element => {

    return (
        <div className={styles.bookmarkSection}>
            <h2 className={styles.title}>북마크된 포켓몬</h2>
            <ul className={styles.pokemonGrid}>
                {bookmarkedPokemon.map((pokemon) => (
                    <li key={pokemon.pokemonId} className={styles.pokemonItem}>
                        <div className={styles.cardHeader}>
                            <button
                                onClick={() => toggleBookmark(pokemon)}
                                className={styles.bookmarkButton}
                                data-active="true"
                            >
                                <BookmarkMinus size={18} />
                            </button>
                        </div>
                        <Link href={`/poke/${pokemon.pokemonId}`} className={styles.pokemonContent}>
                            <h3>
                                #{pokemon.pokemonId}. {pokemon.koreanName} ({pokemon.name})
                            </h3>
                            <img
                                className={styles.pokemonImage}
                                src={pokemon.sprites.front_default}
                                alt={pokemon.name}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Bookmark;