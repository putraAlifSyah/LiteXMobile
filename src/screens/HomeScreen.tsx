import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { usePosts } from '../hooks/usePosts';
import { useCategories } from '../hooks/useCategories';
import type { Post } from '../services/api';
import { Header } from '../components/Header';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleCardHorizontal } from '../components/ArticleCardHorizontal';
import { CategoryChip } from '../components/CategoryChip';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const PER_PAGE = 10;

// ---------------------------------------------------------------------------
// Trending News Carousel (horizontal)
// ---------------------------------------------------------------------------

const TrendingNews: React.FC<{
  posts: Post[];
  onPress: (postId: number) => void;
}> = ({ posts, onPress }) => {
  return (
    <View style={styles.trendingSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending News</Text>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward-outline" size={12} color={Colors.primary} style={{ marginLeft: 2 }} />
          <Ionicons name="chevron-forward-outline" size={12} color={Colors.primary} style={{ marginLeft: -6 }} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.trendingList}
        keyExtractor={(item) => `trending-${item.id}`}
        renderItem={({ item }) => (
          <ArticleCard
            post={item}
            onPress={() => onPress(item.id)}
            horizontalMode
          />
        )}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Home Screen
// ---------------------------------------------------------------------------

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts(selectedCategory);

  const { data: categories = [] } = useCategories();

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];
  const trendingPosts = allPosts.slice(0, 5);
  const globalStories = allPosts.slice(5);

  const navigateToArticle = useCallback(
    (postId: number) => {
      navigation.navigate('ArticleDetail', { postId });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderGlobalStory = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => (
      <ArticleCardHorizontal post={item} onPress={() => navigateToArticle(item.id)} />
    ),
    [navigateToArticle],
  );

  // ---- Loading state ----
  if (isLoading) {
    return (
      <View style={styles.screen}>
        <Header />
        <View style={styles.loadingContainer}>
          <SkeletonLoader variant="card" count={1} />
          <View style={{ height: Spacing.lg }} />
          <SkeletonLoader variant="horizontal" count={3} />
        </View>
      </View>
    );
  }

  // ---- Error state ----
  if (isError) {
    return (
      <View style={styles.screen}>
        <Header />
        <EmptyState
          icon="cloud-offline-outline"
          title="Gagal memuat berita"
          subtitle="Periksa koneksi internet Anda dan coba lagi."
          actionLabel="Coba Lagi"
          onAction={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Header />
      <FlatList
        data={globalStories}
        keyExtractor={(item) => `global-${item.id}`}
        renderItem={renderGlobalStory}
        contentContainerStyle={styles.feedContainer}
        ListHeaderComponent={
          <>
            {/* Trending Section */}
            {trendingPosts.length > 0 && (
              <TrendingNews posts={trendingPosts} onPress={navigateToArticle} />
            )}

            {/* Category Filter Section */}
            <View style={styles.categoryContainer}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[{ id: null, name: 'All' }, ...categories.slice(0, 8)]}
                keyExtractor={(item) => `cat-${item.id}`}
                contentContainerStyle={styles.categoryList}
                renderItem={({ item }) => (
                  <CategoryChip
                    label={item.name}
                    isSelected={selectedCategory === item.id}
                    onPress={() => setSelectedCategory(item.id)}
                  />
                )}
              />
            </View>

            {/* Global Stories Header */}
            <View style={styles.sectionHeaderGlobal}>
              <Text style={styles.sectionTitle}>Global Stories</Text>
              <TouchableOpacity style={styles.viewAllBtn}>
                <Text style={styles.viewAllText}>View All</Text>
                <Ionicons name="chevron-forward-outline" size={12} color={Colors.primary} style={{ marginLeft: 2 }} />
                <Ionicons name="chevron-forward-outline" size={12} color={Colors.primary} style={{ marginLeft: -6 }} />
              </TouchableOpacity>
            </View>
          </>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={styles.footerLoader}
            />
          ) : null
        }
        ListEmptyComponent={
          <EmptyState
            icon="newspaper-outline"
            title="Belum ada berita"
            subtitle="Tarik ke bawah untuk memuat ulang."
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background, // Match Newsify greyish background
  },
  loadingContainer: {
    paddingTop: Spacing.lg,
  },
  feedContainer: {
    paddingBottom: Spacing['3xl'],
  },
  trendingSection: {
    marginTop: Spacing.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionHeaderGlobal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: Colors.primary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  trendingList: {
    paddingLeft: Spacing.base, // ArticleCard horizontalMode adds marginRight, so we only need paddingLeft here
  },
  categoryContainer: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  categoryList: {
    paddingHorizontal: Spacing.base,
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
});

export default HomeScreen;
