import React from 'react';
import { Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { useSettingsStore } from '../store/settingsStore';
import type { RootStackParamList, BottomTabParamList } from './types';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { CategoryScreen } from '../screens/CategoryScreen';
import { BookmarkScreen } from '../screens/BookmarkScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { ArticleDetailScreen } from '../screens/ArticleDetailScreen';
import { CategoryArticlesScreen } from '../screens/CategoryArticlesScreen';

// ---------------------------------------------------------------------------
// Bottom Tab Navigator
// ---------------------------------------------------------------------------

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TAB_ICONS: Record<
  keyof BottomTabParamList,
  { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap; label: string }
> = {
  Beranda: { focused: 'home', unfocused: 'home-outline', label: 'Home' },
  Kategori: { focused: 'compass', unfocused: 'compass-outline', label: 'Discover' },
  Tersimpan: { focused: 'bookmark', unfocused: 'bookmark-outline', label: 'Bookmark' },
  Lainnya: { focused: 'person', unfocused: 'person-outline', label: 'Profile' },
  // Hide search from tabs to match Newsify's 4-tab design, but keep it in types if needed
  Cari: { focused: 'search', unfocused: 'search-outline', label: 'Search' },
};

const MainTabs: React.FC = () => {
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);
  
  const surfaceBg = isDarkMode ? Colors.dark.surface : '#FFFFFF';
  const inactiveColor = isDarkMode ? Colors.dark.text.disabled : '#9E9E9E';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          if (!icons) return null;
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarLabel: TAB_ICONS[route.name]?.label || route.name,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: surfaceBg,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? Colors.dark.border : Colors.divider,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 12,
          elevation: 0, // Newsify tabs look flat/clean
          shadowColor: 'transparent',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter_600SemiBold',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Kategori" component={CategoryScreen} />
      <Tab.Screen name="Tersimpan" component={BookmarkScreen} />
      <Tab.Screen name="Lainnya" component={MoreScreen} />
    </Tab.Navigator>
  );
};

// ---------------------------------------------------------------------------
// Root Stack Navigator
// ---------------------------------------------------------------------------

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.background }, // We could use dynamic bg here but Root is usually static
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="CategoryArticles"
        component={CategoryArticlesScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
