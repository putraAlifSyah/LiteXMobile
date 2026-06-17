import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Post } from '../services/api';

const STORAGE_KEY = '@litex/bookmarks';

interface BookmarkState {
  bookmarks: Post[];
  isLoaded: boolean;
  addBookmark: (post: Post) => void;
  removeBookmark: (postId: number) => void;
  isBookmarked: (postId: number) => boolean;
  loadBookmarks: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  isLoaded: false,

  addBookmark: (post: Post) => {
    const { bookmarks } = get();
    if (bookmarks.some((b) => b.id === post.id)) return;

    const updated = [post, ...bookmarks];
    set({ bookmarks: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
  },

  removeBookmark: (postId: number) => {
    const updated = get().bookmarks.filter((b) => b.id !== postId);
    set({ bookmarks: updated });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
  },

  isBookmarked: (postId: number) => {
    return get().bookmarks.some((b) => b.id === postId);
  },

  loadBookmarks: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Post[] = JSON.parse(raw);
        set({ bookmarks: parsed, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
      set({ isLoaded: true });
    }
  },
}));
