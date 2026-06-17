import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getPosts, getPost, searchPosts, getPostsByCategory } from '../services/api';

const PER_PAGE = 10;

export function usePosts(categoryId?: number | null) {
  return useInfiniteQuery({
    queryKey: ['posts', { categoryId }],
    queryFn: ({ pageParam }) =>
      categoryId
        ? getPostsByCategory(categoryId, pageParam, PER_PAGE)
        : getPosts(pageParam, PER_PAGE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPageParam < lastPage.totalPages ? lastPageParam + 1 : undefined,
  });
}

export function usePostDetail(postId: number) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });
}

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => searchPosts(query),
    enabled: query.length >= 2,
  });
}
