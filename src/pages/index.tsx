import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GetServerSideProps } from "next";
import apiClient from "../lib/apiClient";
import { fetchPokemonDetails } from "../lib/pokemonApi";
import Bookmark from "../components/Bookmark";
import styles from "../styles/Pokedex.module.css";

interface Pokemon {
    id: number;
    name: string;
    koreanName: string;
    sprites: {
        front_default: string;
    };
}

interface PokemonApiResult {
    name: string;
    url: string;
}

interface ApiResponse<T> {
    results: T[];
}

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
        const limit = 20; // 한 페이지에 표시할 포켓몬 수
        const offset = (currentPage - 1) * limit;

        // 전체 포켓몬 리스트 가져오기
        const apiUrl = `/pokemon?limit=151`;
        const { results: allPokemon }: ApiResponse<PokemonApiResult> = await apiClient.get(apiUrl);

        const detailedPokemon = await Promise.all(
            allPokemon.map(async (pokemon: { name: string; url: string }) => {
                const details = await fetchPokemonDetails(pokemon.url);
                return details;
            })
        );

        // 검색 필터링 (detailedPokemon 기준으로 검색어 필터링)
        const filteredPokemon = detailedPokemon.filter((pokemon: Pokemon) =>
            pokemon.name.toLowerCase().includes(searchQuery) ||
            pokemon.koreanName.toLowerCase().includes(searchQuery) ||
            pokemon.id.toString() === searchQuery
        );

        // 페이지네이션 처리
        const paginatedPokemon = filteredPokemon.slice(offset, offset + limit);

        return {
            props: {
                pokemonList: paginatedPokemon,
                currentPage,
                totalPages: Math.ceil(filteredPokemon.length / limit),
                searchQuery,
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
    const [bookmarkedPokemon, setBookmarkedPokemon] = useState<Pokemon[]>([]);

    // 로컬 스토리지에서 북마크 데이터 로드
    useEffect(() => {
        const storedBookmarks = localStorage.getItem("bookmarkedPokemon");
        if (storedBookmarks) {
            setBookmarkedPokemon(JSON.parse(storedBookmarks));
        }
    }, []);

    // 북마크 추가/제거 함수
    const toggleBookmark = (pokemon: Pokemon) => {
        const isBookmarked = bookmarkedPokemon.some((p) => p.id === pokemon.id);
        let updatedBookmarks;

        if (isBookmarked) {
            // 이미 북마크된 포켓몬이면 제거
            updatedBookmarks = bookmarkedPokemon.filter((p) => p.id !== pokemon.id);
        } else {
            // 북마크에 추가
            updatedBookmarks = [...bookmarkedPokemon, pokemon];
        }

        setBookmarkedPokemon(updatedBookmarks);
        localStorage.setItem("bookmarkedPokemon", JSON.stringify(updatedBookmarks));
    };

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
                    <li key={pokemon.id} className={styles.pokemonItem}>
                        <h3>
                            <Link href={`/poke/${pokemon.id}`}>
                                #{pokemon.id}. {pokemon.koreanName} ({pokemon.name})
                            </Link>
                        </h3>
                        <Link href={`/poke/${pokemon.id}`}>
                            <img
                                className={styles.pokemonImage}
                                src={pokemon.sprites.front_default}
                                alt={pokemon.name}
                            />
                        </Link>
                        <button
                            onClick={() => toggleBookmark(pokemon)}
                            className={`${styles.bookmarkButton} ${
                                bookmarkedPokemon.some((p) => p.id === pokemon.id) ? styles.remove : styles.add
                            }`}
                        >
                            {bookmarkedPokemon.some((p) => p.id === pokemon.id) ? "북마크 제거" : "북마크"}
                        </button>
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
            <Bookmark bookmarkedPokemon={bookmarkedPokemon} toggleBookmark={toggleBookmark} />
        </div>
    );
};

export default Pokedex;