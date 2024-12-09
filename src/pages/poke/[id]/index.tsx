import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from 'next/router';
import styles from "../../../styles/PokemonDetail.module.css";

interface PokemonDetailProps {
    pokemon: {
        pokemonId: number;
        name: string;
        koreanName: string;
        genus: string;
        sprites: {
            front_default: string;
        };
        types: { name: string; _id: string }[]; 
        stats: {
            stat: { name: string };
            base_stat: string; 
            _id: string;
        }[];
    };
}

const PokemonDetail = ({ pokemon }: PokemonDetailProps): React.JSX.Element => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editedPokemon, setEditedPokemon] = useState(pokemon);

    const handleDelete = async () => {
        if (confirm('정말로 이 포켓몬을 삭제하시겠습니까?')) {
            try {
                const response = await fetch(`/api/pokemon/${pokemon.pokemonId}`, {
                    method: 'DELETE',
                });
                
                if (response.ok) {
                    router.push('/');
                }
            } catch (error) {
                console.error('삭제 실패:', error);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`/api/pokemon/${pokemon.pokemonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedPokemon),
            });

            if (response.ok) {
                setIsEditing(false);
                router.reload();
            }
        } catch (error) {
            console.error('수정 실패:', error);
        }
    };

    // stats 수정을 위함
    const handleStatChange = (statName: string, newValue: string) => {
        setEditedPokemon({
            ...editedPokemon,
            stats: editedPokemon.stats.map(stat => 
                stat.stat.name === statName 
                    ? { ...stat, base_stat: newValue }
                    : stat
            )
        });
    };

    // types 수정을 위함
    const handleTypeChange = (index: number, newValue: string) => {
        const newTypes = [...editedPokemon.types];
        newTypes[index] = { ...newTypes[index], name: newValue };
        setEditedPokemon({
            ...editedPokemon,
            types: newTypes
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    {isEditing ? (
                        <input 
                            className={styles.editInput}
                            value={`#${pokemon.pokemonId}`}
                            disabled
                        />
                    ) : (
                        <h3>#{pokemon.pokemonId}</h3>
                    )}
                    {isEditing ? (
                        <div className={styles.nameInputs}>
                            <input
                                className={styles.editInput}
                                value={editedPokemon.koreanName}
                                onChange={(e) => setEditedPokemon({
                                    ...editedPokemon,
                                    koreanName: e.target.value
                                })}
                            />
                            <input
                                className={styles.editInput}
                                value={editedPokemon.name}
                                onChange={(e) => setEditedPokemon({
                                    ...editedPokemon,
                                    name: e.target.value
                                })}
                            />
                        </div>
                    ) : (
                        <h1>{pokemon.koreanName} ({pokemon.name})</h1>
                    )}
                </div>

                <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.koreanName}
                    className={styles.pokemonImage}
                />

                <div className={styles.details}>
                    <div className={styles.detailRow}>
                        <span className={styles.label}>타입:</span>
                        {isEditing ? (
                            <div className={styles.typeInputs}>
                                {editedPokemon.types.map((type, index) => (
                                    <input
                                        key={type._id}
                                        className={styles.editInput}
                                        value={type.name}
                                        onChange={(e) => handleTypeChange(index, e.target.value)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <span className={styles.value}>{pokemon.types.map(type => type.name).join(", ")}</span>
                        )}
                    </div>

                    <div className={styles.detailRow}>
                        <span className={styles.label}>분류:</span>
                        {isEditing ? (
                            <input
                                className={styles.editInput}
                                value={editedPokemon.genus}
                                onChange={(e) => setEditedPokemon({
                                    ...editedPokemon,
                                    genus: e.target.value
                                })}
                            />
                        ) : (
                            <span className={styles.value}>{pokemon.genus}</span>
                        )}
                    </div>

                    <div className={styles.statsSection}>
                        <h3>능력치:</h3>
                        <div className={styles.stats}>
                            {(isEditing ? editedPokemon : pokemon).stats.map((stat) => (
                                <div key={stat._id} className={styles.statRow}>
                                    <span className={styles.statLabel}>{stat.stat.name}:</span>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            className={styles.editInput}
                                            value={stat.base_stat}
                                            onChange={(e) => handleStatChange(stat.stat.name, e.target.value)}
                                        />
                                    ) : (
                                        <span className={styles.statValue}>{stat.base_stat}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    {isEditing ? (
                        <>
                            <button className={styles.saveButton} onClick={handleUpdate}>저장</button>
                            <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>취소</button>
                        </>
                    ) : (
                        <>
                            <button className={styles.editButton} onClick={() => setIsEditing(true)}>수정</button>
                            <button className={styles.deleteButton} onClick={handleDelete}>삭제</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.params as { id: string };
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pokemon/${id}`);
    
    if (!res.ok) {
        return {
            notFound: true
        };
    }

    const pokemon = await res.json();

    return {
        props: {
            pokemon,
        },
    };
};

export default PokemonDetail;