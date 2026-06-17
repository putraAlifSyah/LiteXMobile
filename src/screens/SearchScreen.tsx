import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  ListRenderItemInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { useSearchPosts } from '../hooks/usePosts';
import type { Post } from '../services/api';
import { ArticleCard } from '../components/ArticleCard';
import { EmptyState } from '../components/EmptyState';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const RECENT_SEARCHES_KEY = '@litex/recent_searches';
const MAX_RECENT = 8;

export const SearchScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();

  const [inputValue, setInputValue] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // ---- Debounce ----
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // ---- Load recent searches ----
  useEffect(() => {
    AsyncStorage.getItem(RECENT_SEARCHES_KEY)
      .then((raw) => {
        if (raw) setRecentSearches(JSON.parse(raw));
      })
      .catch(() => {});
  }, []);

  const addRecentSearch = useCallback(
    async (term: string) => {
      const updated = [
        term,
        ...recentSearches.filter((s) => s !== term),
      ].slice(0, MAX_RECENT);
      setRecentSearches(updated);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updated),
      ).catch(() => {});
    },
    [recentSearches],
  );

  const clearRecentSearches = useCallback(async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY).catch(() => {});
  }, []);

  // ---- Search query ----
  const {
    data,
    isLoading,
    isFetching,
  } = useSearchPosts(debouncedQuery);

  const results = data?.data ?? [];

  // Save to recent when a query returns results
  useEffect(() => {
    if (debouncedQuery.length >= 2 && results.length > 0) {
      addRecentSearch(debouncedQuery);
    }
  }, [debouncedQuery, results.length]);

  const navigateToArticle = useCallback(
    (postId: number) => {
      Keyboard.dismiss();
      navigation.navigate('ArticleDetail', { postId });
    },
    [navigation],
  );

  const handleRecentTap = useCallback((term: string) => {
    setInputValue(term);
    setDebouncedQuery(term);
  }, []);

  const renderArticle = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => (
      <ArticleCard post={item} onPress={() => navigateToArticle(item.id)} />
    ),
    [navigateToArticle],
  );

  const showRecent =
    debouncedQuery.length < 2 && recentSearches.length > 0;

  return (
    <View style={styles.screen}>
      {/* Search Bar */}
      <View style={[styles.searchBar, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="search-outline"
            size={20}
            color={Colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Cari berita..."
            placeholderTextColor={Colors.text.disabled}
            value={inputValue}
            onChangeText={setInputValue}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {inputValue.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setInputValue('');
                setDebouncedQuery('');
              }}
              style={styles.clearButton}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.text.disabled}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading indicator */}
      {isFetching && debouncedQuery.length >= 2 && (
        <View style={styles.loadingBar}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Mencari...</Text>
        </View>
      )}

      {/* Recent Searches */}
      {showRecent && (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Pencarian Terakhir</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.clearAll}>Hapus Semua</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((term, index) => (
            <TouchableOpacity
              key={`${term}-${index}`}
              style={styles.recentItem}
              onPress={() => handleRecentTap(term)}
            >
              <Ionicons
                name="time-outline"
                size={18}
                color={Colors.text.secondary}
              />
              <Text style={styles.recentText}>{term}</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={16}
                color={Colors.text.disabled}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results */}
      {debouncedQuery.length >= 2 && !isFetching && (
        <FlatList
          data={results}
          keyExtractor={(item) => `search-${item.id}`}
          renderItem={renderArticle}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="Tidak ada hasil"
              subtitle={`Pencarian "${debouncedQuery}" tidak menemukan artikel.`}
            />
          }
          ListHeaderComponent={
            results.length > 0 ? (
              <Text style={styles.resultCount}>
                {data?.totalItems ?? results.length} hasil ditemukan
              </Text>
            ) : null
          }
        />
      )}

      {/* Initial empty state */}
      {debouncedQuery.length < 2 && recentSearches.length === 0 && (
        <EmptyState
          icon="search-outline"
          title="Cari Berita"
          subtitle="Ketik minimal 2 karakter untuk mulai mencari artikel."
        />
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 46,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.body1,
    color: Colors.text.primary,
    paddingVertical: 0,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.text.secondary,
  },
  recentSection: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  recentTitle: {
    ...Typography.subtitle1,
    color: Colors.text.primary,
  },
  clearAll: {
    ...Typography.caption,
    color: Colors.primary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.md,
  },
  recentText: {
    ...Typography.body2,
    color: Colors.text.primary,
    flex: 1,
  },
  listContent: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  resultCount: {
    ...Typography.caption,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
});

export default SearchScreen;
