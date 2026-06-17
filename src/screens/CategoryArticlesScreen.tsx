import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { useCategoryPosts } from '../hooks/useCategories';
import type { Post } from '../services/api';
import { ArticleCard } from '../components/ArticleCard';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryArticles'>;

const PER_PAGE = 10;

export const CategoryArticlesScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { categoryId, categoryName } = route.params;
  const insets = useSafeAreaInsets();

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useCategoryPosts(categoryId);

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

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

  const renderArticle = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => (
      <ArticleCard post={item} onPress={() => navigateToArticle(item.id)} />
    ),
    [navigateToArticle],
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {categoryName}
          </Text>
          {data && (
            <Text style={styles.headerCount}>
              {data.pages[0]?.totalItems ?? 0} artikel
            </Text>
          )}
        </View>
        <View style={{ width: 38 }} />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <SkeletonLoader count={4} />
        </View>
      ) : isError ? (
        <EmptyState
          icon="cloud-offline-outline"
          title="Gagal memuat berita"
          subtitle="Periksa koneksi internet Anda."
          actionLabel="Coba Lagi"
          onAction={() => refetch()}
        />
      ) : (
        <FlatList
          data={allPosts}
          keyExtractor={(item) => `cat-post-${item.id}`}
          renderItem={renderArticle}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <EmptyState
              icon="newspaper-outline"
              title="Belum ada berita"
              subtitle={`Kategori "${categoryName}" belum memiliki artikel.`}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleGroup: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h5,
    color: Colors.text.primary,
  },
  headerCount: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  loadingContainer: {
    paddingTop: Spacing.base,
  },
  listContent: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  footerLoader: {
    paddingVertical: Spacing.xl,
  },
});

export default CategoryArticlesScreen;
