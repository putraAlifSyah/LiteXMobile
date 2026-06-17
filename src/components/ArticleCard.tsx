import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing } from '../constants/spacing';
import { useSettingsStore } from '../store/settingsStore';
import type { Post } from '../services/api';
import {
  getCategoryName,
  getFeaturedImageUrl,
  stripHTML,
  timeAgo,
} from '../utils/helpers';

interface ArticleCardProps {
  post: Post;
  onPress: () => void;
  horizontalMode?: boolean; // If used in a horizontal carousel
}

export const ArticleCard: React.FC<ArticleCardProps> = React.memo(({ post, onPress, horizontalMode }) => {
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);

  const imageUrl = getFeaturedImageUrl(post, 'medium');
  const category = getCategoryName(post).toUpperCase();
  const title = stripHTML(post.title.rendered);
  const time = timeAgo(post.date);

  const cardBg = isDarkMode ? Colors.dark.surface : Colors.surface;
  const textPrimary = isDarkMode ? Colors.dark.text.primary : Colors.text.primary;
  const textSecondary = isDarkMode ? Colors.dark.text.secondary : Colors.text.secondary;
  const borderColor = isDarkMode ? Colors.dark.border : Colors.border;

  // Split category name to mimic the "SCREENRANT" style if possible
  const catWordIdx = Math.floor(category.length / 2);
  const catPart1 = category.substring(0, catWordIdx);
  const catPart2 = category.substring(catWordIdx);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: cardBg,
          borderColor,
          width: horizontalMode ? 280 : 'auto', // Fixed width for carousel
          marginRight: horizontalMode ? Spacing.base : 0,
        },
      ]}
    >
      {/* Thumbnail */}
      <View style={styles.imageWrapper}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.image,
              styles.placeholder,
              {
                backgroundColor: isDarkMode
                  ? Colors.dark.surfaceVariant
                  : Colors.skeleton,
              },
            ]}
          >
            <Ionicons name="image-outline" size={32} color={Colors.text.disabled} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.body}>
        <Text
          style={[styles.title, { color: textPrimary }]}
          numberOfLines={3}
        >
          {title}
        </Text>

        {/* Publisher / Category mimicking Newsify publisher style */}
        <View style={styles.publisherRow}>
          <Text style={[styles.publisherText, { color: textPrimary }]}>
            {catPart1}<Text style={{ color: Colors.secondary }}>{catPart2}</Text>
          </Text>
        </View>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: textSecondary, flex: 1 }]}>
            {time}
          </Text>
          
          <View style={styles.metaIcons}>
            <Ionicons name="eye-outline" size={14} color={textSecondary} />
            <Text style={[styles.metaIconText, { color: textSecondary }]}>12k</Text>
            
            <Ionicons name="chatbubble-outline" size={13} color={textSecondary} style={{ marginLeft: 8 }} />
            <Text style={[styles.metaIconText, { color: textSecondary }]}>34</Text>
            
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={18} color={textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="ellipsis-vertical" size={16} color={textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    overflow: 'hidden',
    // Newsify has very light or no shadow for these cards
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: Spacing.md,
  },
  title: {
    ...Typography.h4, // Playfair Display SemiBold
    marginBottom: Spacing.sm,
  },
  publisherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  publisherText: {
    ...Typography.overline,
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  metaText: {
    ...Typography.caption,
    fontSize: 11,
  },
  metaIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIconText: {
    ...Typography.caption,
    fontSize: 10,
    marginLeft: 4,
  },
  iconBtn: {
    marginLeft: Spacing.md,
  },
});

export default ArticleCard;
