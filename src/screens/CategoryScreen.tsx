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
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { useCategories } from '../hooks/useCategories';
import type { Category } from '../services/api';
import { EmptyState } from '../components/EmptyState';
import { Header } from '../components/Header';
import { useSettingsStore } from '../store/settingsStore';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

// ---------------------------------------------------------------------------
// Category Card
// ---------------------------------------------------------------------------

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  berita: 'newspaper-outline',
  teknologi: 'hardware-chip-outline',
  olahraga: 'football-outline',
  hiburan: 'film-outline',
  bisnis: 'briefcase-outline',
  politik: 'podium-outline',
  kesehatan: 'medkit-outline',
  pendidikan: 'school-outline',
  otomotif: 'car-outline',
  travel: 'airplane-outline',
  kuliner: 'restaurant-outline',
  gaya: 'shirt-outline',
};

function getCategoryIcon(slug: string): keyof typeof Ionicons.glyphMap {
  const lower = slug.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return 'folder-outline';
}

const CategoryCard: React.FC<{
  category: Category;
  onPress: () => void;
  isDarkMode: boolean;
}> = ({ category, onPress, isDarkMode }) => {
  const icon = getCategoryIcon(category.slug);

  const cardBg = isDarkMode ? Colors.dark.surface : Colors.surface;
  const textPrimary = isDarkMode ? Colors.dark.text.primary : Colors.text.primary;
  const textSecondary = isDarkMode ? Colors.dark.text.secondary : Colors.text.secondary;
  const borderColor = isDarkMode ? Colors.dark.border : Colors.border;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg, borderColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={24} color={Colors.primary} />
      </View>
      <Text style={[styles.cardName, { color: textPrimary }]} numberOfLines={2}>
        {category.name}
      </Text>
      <Text style={[styles.cardCount, { color: textSecondary }]}>
        {category.count} {category.count === 1 ? 'article' : 'articles'}
      </Text>
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Category Screen
// ---------------------------------------------------------------------------

export const CategoryScreen: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);

  const { data: categories = [], isLoading, isError, refetch } = useCategories();

  // Filter out uncategorized (id=1 in WP) and categories with 0 posts
  const filtered = categories.filter(
    (cat) => cat.slug !== 'uncategorized' && cat.count > 0,
  );

  const handlePress = useCallback(
    (category: Category) => {
      navigation.navigate('CategoryArticles', {
        categoryId: category.id,
        categoryName: category.name,
      });
    },
    [navigation],
  );

  const renderCategory = useCallback(
    ({ item }: ListRenderItemInfo<Category>) => (
      <CategoryCard category={item} onPress={() => handlePress(item)} isDarkMode={isDarkMode} />
    ),
    [handlePress, isDarkMode],
  );

  const screenBg = isDarkMode ? Colors.dark.background : Colors.background;
  const textPrimary = isDarkMode ? Colors.dark.text.primary : Colors.text.primary;
  const textSecondary = isDarkMode ? Colors.dark.text.secondary : Colors.text.secondary;

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: screenBg }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screen, { backgroundColor: screenBg }]}>
        <Header />
        <EmptyState
          icon="cloud-offline-outline"
          title="Gagal memuat kategori"
          subtitle="Periksa koneksi internet dan coba lagi."
          actionLabel="Coba Lagi"
          onAction={() => refetch()}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: screenBg }]}>
      <Header />
      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>Discover</Text>
        <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
          Explore news by category
        </Text>
      </View>

      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => `cat-${item.id}`}
        renderItem={renderCategory}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="folder-open-outline"
            title="Tidak ada kategori"
            subtitle="Kategori berita belum tersedia."
          />
        }
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
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    ...Typography.h3,
    fontFamily: 'PlayfairDisplay_800ExtraBold',
    fontSize: 28,
  },
  headerSubtitle: {
    ...Typography.body2,
    fontFamily: 'Inter_400Regular',
    marginTop: Spacing.xs,
  },
  grid: {
    padding: Spacing.base,
    paddingBottom: Spacing['3xl'],
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.base,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardName: {
    ...Typography.subtitle1,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardCount: {
    ...Typography.caption,
    textAlign: 'center',
  },
});

export default CategoryScreen;
