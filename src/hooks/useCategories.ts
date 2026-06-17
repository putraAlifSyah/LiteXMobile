import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getCategories, getPostsByCategory } from '../services/api';

const PER_PAGE = 10;

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
}

export function useCategoryPosts(categoryId: number) {
  return useInfiniteQuery({
    queryKey: ['posts', 'category', categoryId],
    queryFn: ({ pageParam }) => getPostsByCategory(categoryId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
    enabled: !!categoryId,
  });
}
