import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import RenderHtml from 'react-native-render-html';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { getPost } from '../services/api';
import { Header } from '../components/Header';
import {
  getFeaturedImageUrl,
  getCategoryName,
  timeAgo,
  stripHTML,
} from '../utils/helpers';
import { useBookmarkStore } from '../store/bookmarkStore';
import { EmptyState } from '../components/EmptyState';
import { useSettingsStore } from '../store/settingsStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ArticleDetail'>;

export const ArticleDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { postId } = route.params;
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = width - Spacing.base * 2;
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarkStore();

  const { data: post, isLoading, isError, refetch } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
  });

  const bookmarked = post ? isBookmarked(post.id) : false;

  const handleBookmark = useCallback(() => {
    if (!post) return;
    if (bookmarked) {
      removeBookmark(post.id);
    } else {
      addBookmark(post);
    }
  }, [post, bookmarked, addBookmark, removeBookmark]);

  const handleShare = useCallback(async () => {
    if (!post) return;
    try {
      await Share.share({
        title: stripHTML(post.title.rendered),
        message: `${stripHTML(post.title.rendered)}\n\nBaca selengkapnya di LiteX:\n${post.link}`,
        url: post.link,
      });
    } catch {
      // User cancelled
    }
  }, [post]);

  const textPrimary = isDarkMode ? Colors.dark.text.primary : Colors.text.primary;
  const textSecondary = isDarkMode ? Colors.dark.text.secondary : Colors.text.secondary;
  const screenBg = isDarkMode ? Colors.dark.background : Colors.background;

  // ---- HTML rendering config ----
  const tagsStyles = {
    body: {
      color: textPrimary,
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      lineHeight: 28,
    },
    p: {
      marginBottom: 16,
    },
    a: {
      color: Colors.primary,
      textDecorationLine: 'none' as const,
    },
    img: {
      borderRadius: 12,
    },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: Colors.primary,
      paddingLeft: 12,
      fontStyle: 'italic' as const,
      color: textSecondary,
    },
    figcaption: {
      fontSize: 12,
      color: textSecondary,
      textAlign: 'center' as const,
      marginTop: 4,
    },
  };

  // ---- Loading ----
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: screenBg }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // ---- Error ----
  if (isError || !post) {
    return (
      <View style={[styles.screen, { backgroundColor: screenBg }]}>
        <EmptyState
          icon="alert-circle-outline"
          title="Gagal memuat artikel"
          subtitle="Silakan coba lagi."
          actionLabel="Coba Lagi"
          onAction={() => refetch()}
        />
      </View>
    );
  }

  const imageUrl = getFeaturedImageUrl(post);
  const category = getCategoryName(post).toUpperCase();
  const title = post.title.rendered
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&quot;/g, '"');

  const catWordIdx = Math.floor(category.length / 2);
  const catPart1 = category.substring(0, catWordIdx);
  const catPart2 = category.substring(catWordIdx);

  return (
    <View style={[styles.screen, { backgroundColor: screenBg }]}>
      <Header />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* ---- Sub Header: Back & Actions ---- */}
          <View style={styles.subHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color={textPrimary} />
              <Text style={[styles.backText, { color: textPrimary }]}>Back</Text>
            </TouchableOpacity>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleBookmark}>
                <Ionicons name={bookmarked ? "bookmark" : "bookmark-outline"} size={22} color={textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={22} color={textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="ellipsis-vertical" size={22} color={textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ---- Hero Image ---- */}
          <View style={styles.heroContainer}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.heroImage, styles.heroPlaceholder]}>
                <Ionicons name="image-outline" size={40} color={Colors.text.disabled} />
              </View>
            )}
          </View>

          {/* ---- Title ---- */}
          <Text style={[styles.title, { color: textPrimary }]}>{title}</Text>

          {/* ---- Publisher ---- */}
          <View style={styles.publisherRow}>
            <Text style={[styles.publisherText, { color: textPrimary }]}>
              {catPart1}<Text style={{ color: Colors.secondary }}>{catPart2}</Text>
            </Text>
          </View>

          {/* ---- Meta Row ---- */}
          <View style={styles.metaRow}>
            <Text style={[styles.timeText, { color: textSecondary, flex: 1 }]}>
              {timeAgo(post.date)}
            </Text>
            <View style={styles.metaIcons}>
              <Ionicons name="eye-outline" size={14} color={textSecondary} />
              <Text style={[styles.metaIconText, { color: textSecondary }]}>12k</Text>
              
              <Ionicons name="chatbubble-outline" size={13} color={textSecondary} style={{ marginLeft: 8 }} />
              <Text style={[styles.metaIconText, { color: textSecondary }]}>34</Text>
              
              <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={18} color={textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="ellipsis-vertical" size={16} color={textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ---- HTML Content ---- */}
          <View style={styles.htmlContainer}>
            <RenderHtml
              contentWidth={contentWidth}
              source={{ html: post.content.rendered }}
              tagsStyles={tagsStyles}
              enableExperimentalMarginCollapsing
            />
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.base,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
    marginTop: Spacing.xs,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    ...Typography.subtitle1,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 4,
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginLeft: Spacing.md,
  },
  heroContainer: {
    marginBottom: Spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  heroPlaceholder: {
    backgroundColor: Colors.skeleton,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    fontSize: 26,
    lineHeight: 34,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  publisherRow: {
    marginBottom: Spacing.md,
  },
  publisherText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  timeText: {
    ...Typography.caption,
    fontSize: 12,
  },
  metaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIconText: {
    ...Typography.caption,
    fontSize: 11,
    marginLeft: 4,
  },
  iconBtn: {
    marginLeft: Spacing.md,
  },
  htmlContainer: {
    marginTop: Spacing.xs,
  },
});

export default ArticleDetailScreen;
