import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookmarkPokemon } from '../types/pokemon';

export function useBookmarks() {
  const queryClient = useQueryClient();

  // 북마크 조회
  const { data: bookmarks = [], isLoading, error } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const response = await fetch('/api/bookmarks');
      return response.json();
    }
  });

  // 북마크 추가
  const addBookmark = useMutation({
    mutationFn: async (pokemon: BookmarkPokemon) => {
      const bookmarkData = {
        pokemonId: pokemon.pokemonId,
        name: pokemon.name,
        koreanName: pokemon.koreanName,
        sprites: pokemon.sprites
      };

      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmarkData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    }
  });

  // 북마크 삭제
  const removeBookmark = useMutation({
    mutationFn: async (pokemonId: number) => {
      await fetch(`/api/bookmarks?pokemonId=${pokemonId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    }
  });

  return {
    bookmarks,
    isLoading,
    error,
    addBookmark,
    removeBookmark
  };
}