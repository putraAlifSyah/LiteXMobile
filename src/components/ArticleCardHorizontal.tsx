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

const IMAGE_SIZE = 100;

interface ArticleCardHorizontalProps {
  post: Post;
  onPress: () => void;
}

export const ArticleCardHorizontal: React.FC<ArticleCardHorizontalProps> = React.memo(({
  post,
  onPress,
}) => {
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);

  const imageUrl = getFeaturedImageUrl(post, 'thumbnail');
  const category = getCategoryName(post).toUpperCase();
  const title = stripHTML(post.title.rendered);
  const time = timeAgo(post.date);

  const cardBg = isDarkMode ? Colors.dark.surface : Colors.surface;
  const textPrimary = isDarkMode ? Colors.dark.text.primary : Colors.text.primary;
  const textSecondary = isDarkMode ? Colors.dark.text.secondary : Colors.text.secondary;
  const borderColor = isDarkMode ? Colors.dark.border : Colors.border;

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
            <Ionicons name="image-outline" size={24} color={Colors.text.disabled} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.body}>
        <Text
          style={[styles.title, { color: textPrimary }]}
          numberOfLines={2}
        >
          {title}
        </Text>

        <View style={styles.publisherRow}>
          <Text style={[styles.publisherText, { color: textPrimary }]}>
            {catPart1}<Text style={{ color: Colors.secondary }}>{catPart2}</Text>
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={[styles.timeText, { color: textSecondary }]}>
            {time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.base,
    // Newsify uses very light border, no heavy shadow
  },
  imageWrapper: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  title: {
    ...Typography.subtitle1, // Inter SemiBold or Playfair, let's stick to Inter for smaller horizontal cards to keep readability
    fontFamily: 'PlayfairDisplay_700Bold', // Actually let's use serif to match
    fontSize: 16,
    marginBottom: Spacing.xs + 2,
    letterSpacing: -0.1,
  },
  publisherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  publisherText: {
    ...Typography.overline,
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    ...Typography.caption,
    fontSize: 11,
  },
});

export default ArticleCardHorizontal;
