import type { NavigatorScreenParams } from '@react-navigation/native';

// ---------------------------------------------------------------------------
// Bottom Tab Navigator
// ---------------------------------------------------------------------------

export type BottomTabParamList = {
  Beranda: undefined;
  Kategori: undefined;
  Cari: undefined;
  Tersimpan: undefined;
  Lainnya: undefined;
};

// ---------------------------------------------------------------------------
// Root Stack Navigator (wraps tab navigator + detail screens)
// ---------------------------------------------------------------------------

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  ArticleDetail: { postId: number };
  CategoryArticles: { categoryId: number; categoryName: string };
};

// ---------------------------------------------------------------------------
// Convenience helpers for screen props
// ---------------------------------------------------------------------------

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
