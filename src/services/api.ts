import axios, { type AxiosResponse } from 'axios';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface FeaturedMediaSize {
  source_url: string;
  width: number;
  height: number;
  mime_type: string;
}

export interface FeaturedMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: {
      thumbnail?: FeaturedMediaSize;
      medium?: FeaturedMediaSize;
      medium_large?: FeaturedMediaSize;
      large?: FeaturedMediaSize;
      full?: FeaturedMediaSize;
      [key: string]: FeaturedMediaSize | undefined;
    };
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  avatar_urls: Record<string, string>;
}

export interface Post {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: FeaturedMedia[];
    'wp:term'?: WPTerm[][];
    author?: WPAuthor[];
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
  description: string;
  link: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalItems: number;
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

const api = axios.create({
  baseURL: 'https://litex.co.id/wp-json/wp/v2',
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parsePagination<T>(response: AxiosResponse<T[]>): PaginatedResponse<T> {
  const headers = response.headers;
  return {
    data: response.data,
    totalPages: Number(headers['x-wp-totalpages'] ?? 1),
    totalItems: Number(headers['x-wp-total'] ?? response.data.length),
  };
}

// ---------------------------------------------------------------------------
// API methods
// ---------------------------------------------------------------------------

export async function getPosts(
  page: number = 1,
  perPage: number = 10,
): Promise<PaginatedResponse<Post>> {
  const response = await api.get<Post[]>('/posts', {
    params: {
      page,
      per_page: perPage,
      _embed: true,
    },
  });
  return parsePagination(response);
}

export async function getPostsByCategory(
  categoryId: number,
  page: number = 1,
  perPage: number = 10,
): Promise<PaginatedResponse<Post>> {
  const response = await api.get<Post[]>('/posts', {
    params: {
      categories: categoryId,
      page,
      per_page: perPage,
      _embed: true,
    },
  });
  return parsePagination(response);
}

export async function getPost(id: number): Promise<Post> {
  const response = await api.get<Post>(`/posts/${id}`, {
    params: { _embed: true },
  });
  return response.data;
}

export async function searchPosts(
  query: string,
  page: number = 1,
  perPage: number = 10,
): Promise<PaginatedResponse<Post>> {
  const response = await api.get<Post[]>('/posts', {
    params: {
      search: query,
      page,
      per_page: perPage,
      _embed: true,
    },
  });
  return parsePagination(response);
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories', {
    params: {
      per_page: 100,
      orderby: 'count',
      order: 'desc',
    },
  });
  return response.data;
}

export default api;
