import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import type { Post } from '../services/api';
import { useBookmarkStore } from '../store/bookmarkStore';
import { ArticleCard } from '../components/ArticleCard';
import { EmptyState } from '../components/EmptyState';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export const BookmarkScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const insets = useSafeAreaInsets();
  const { bookmarks, removeBookmark, loadBookmarks, isLoaded } =
    useBookmarkStore();

  useEffect(() => {
    if (!isLoaded) {
      loadBookmarks();
    }
  }, [isLoaded, loadBookmarks]);

  const navigateToArticle = useCallback(
    (postId: number) => {
      navigation.navigate('ArticleDetail', { postId });
    },
    [navigation],
  );

  const handleLongPress = useCallback(
    (post: Post) => {
      Alert.alert(
        'Hapus Bookmark',
        `Hapus "${post.title.rendered.replace(/&#8217;/g, "'").replace(/&amp;/g, '&')}" dari bookmark?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Hapus',
            style: 'destructive',
            onPress: () => removeBookmark(post.id),
          },
        ],
      );
    },
    [removeBookmark],
  );

  const renderArticle = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => (
      <View>
        <ArticleCard
          post={item}
          onPress={() => navigateToArticle(item.id)}
        />
      </View>
    ),
    [navigateToArticle],
  );

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text style={styles.headerTitle}>Tersimpan</Text>
        {bookmarks.length > 0 && (
          <Text style={styles.headerCount}>
            {bookmarks.length} artikel
          </Text>
        )}
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => `bookmark-${item.id}`}
        renderItem={({ item }) => (
          <View
            onStartShouldSetResponder={() => false}
          >
            <ArticleCard
              post={item}
              onPress={() => navigateToArticle(item.id)}
            />
          </View>
        )}
        contentContainerStyle={[
          styles.listContent,
          bookmarks.length === 0 && styles.emptyContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="Belum ada artikel tersimpan"
            subtitle="Simpan artikel favoritmu untuk dibaca nanti. Tekan ikon bookmark di halaman artikel."
          />
        }
      />

      {/* Tip for long press */}
      {bookmarks.length > 0 && (
        <View style={[styles.tip, { paddingBottom: insets.bottom + Spacing.sm }]}>
          <Text style={styles.tipText}>
            Tekan dan tahan artikel untuk menghapus dari bookmark
          </Text>
        </View>
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
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
  },
  headerCount: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  listContent: {
    paddingTop: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  emptyContainer: {
    flex: 1,
  },
  tip: {
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    alignItems: 'center',
  },
  tipText: {
    ...Typography.caption,
    color: Colors.text.disabled,
    textAlign: 'center',
  },
});

export default BookmarkScreen;
