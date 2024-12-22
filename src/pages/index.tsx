import React from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Image from 'next/image';
import Bookmark from "../components/Bookmark";
import { useBookmarks } from "../hooks/useBookmarks";
import styles from "../styles/Pokedex.module.css";
import { Pokemon, BookmarkPokemon } from "../types/pokemon";
import { Eye, BookmarkMinus, BookmarkPlus } from "lucide-react";

interface PokedexProps {
    pokemonList: Pokemon[];
    currentPage: number;
    totalPages: number;
    searchQuery: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const { search = "", page = "1" } = context.query;
        const searchQuery = decodeURIComponent((search as string).trim().toLowerCase());
        const currentPage = parseInt(page as string, 10);
        const limit = 20;

        // NestJS API 호출로 변경
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/pokemon?search=${searchQuery}&page=${currentPage}&limit=${limit}`
        );
        
        if (!res.ok) {
            throw new Error('API request failed');
        }

        const data = await res.json();

        return {
            props: {
                pokemonList: data.pokemons || [], // null 대신 빈 배열 반환
                currentPage: data.currentPage || 1,
                totalPages: data.totalPages || 1,
                searchQuery: searchQuery || "",
            },
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        return {
            props: {
                pokemonList: [],
                currentPage: 1,
                totalPages: 1,
                searchQuery: "",
            },
        };
    }
};

const Pokedex = ({ pokemonList, currentPage, totalPages, searchQuery }: PokedexProps): React.JSX.Element => {
    const { bookmarks, isLoading, addBookmark, removeBookmark } = useBookmarks();

    const toggleBookmark = async (pokemon: BookmarkPokemon) => {
        const isBookmarked = bookmarks.some((p: BookmarkPokemon) => p.pokemonId === pokemon.pokemonId);
        try {
          if (isBookmarked) {
            await removeBookmark.mutateAsync(pokemon.pokemonId);
          } else {
            await addBookmark.mutateAsync(pokemon);
          }
        } catch (error) {
          console.error('북마크 토글 실패:', error);
        }
      };

      if (isLoading) {
        return <div>북마크 로딩 중...</div>;
      }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>포켓몬 도감</h1>
            
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="포켓몬 이름 또는 번호를 검색하세요"
                    defaultValue={searchQuery}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const searchValue = (e.target as HTMLInputElement).value;
                            window.location.href = `/?search=${searchValue}&page=1`;
                        }
                    }}
                />
            </div>

            <ul className={styles.pokemonGrid}>
                {pokemonList.map((pokemon) => (
                    <li key={pokemon.pokemonId} className={styles.pokemonItem}>
                        <div className={styles.cardHeader}>
                            <div className={styles.viewCount}>
                                <Eye size={14} />
                                {pokemon.viewCount}
                            </div>
                            <button 
                                onClick={() => {
                                    const { pokemonId, name, koreanName, sprites } = pokemon;
                                    toggleBookmark({ pokemonId, name, koreanName, sprites });
                                }}
                                className={styles.bookmarkButton}
                                data-active={bookmarks.some((p: BookmarkPokemon) => p.pokemonId === pokemon.pokemonId)}
                            >
                                {bookmarks.some((p: BookmarkPokemon) => p.pokemonId === pokemon.pokemonId) 
                                    ? <BookmarkMinus size={18} /> 
                                    : <BookmarkPlus size={18} />
                                }
                            </button>
                        </div>
                        <Link href={`/poke/${pokemon.pokemonId}`} className={styles.pokemonContent}>
                            <h3>#{pokemon.pokemonId}. {pokemon.koreanName} ({pokemon.name})</h3>
                            <Image
                                className={styles.pokemonImage}
                                src={pokemon.sprites.front_default}
                                alt={pokemon.name}
                                width={180}
                                height={180}
                            />
                        </Link>
                    </li>
                ))}
            </ul>

            <div className={styles.pagination}>
                <button
                    disabled={currentPage <= 1}
                    onClick={() => {
                        if (currentPage > 1) {
                            window.location.href = `/?search=${searchQuery}&page=${currentPage - 1}`;
                        }
                    }}
                >
                    이전
                </button>
                <span className={styles.paginationNumbers}>
                    {currentPage} / {totalPages}
                </span>
                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => {
                        if (currentPage < totalPages) {
                            window.location.href = `/?search=${searchQuery}&page=${currentPage + 1}`;
                        }
                    }}
                >
                    다음
                </button>
            </div>
            <Bookmark bookmarkedPokemon={bookmarks} toggleBookmark={toggleBookmark} />
        </div>
    );
};

export default Pokedex;