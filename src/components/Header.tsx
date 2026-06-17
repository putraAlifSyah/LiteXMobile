import React from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Spacing } from '../constants/spacing';
import { useSettingsStore } from '../store/settingsStore';

const HEADER_HEIGHT = 60;

export const Header: React.FC = () => {
  const isDarkMode = useSettingsStore((s) => s.isDarkMode);
  const insets = useSafeAreaInsets();

  const headerBg = isDarkMode ? Colors.dark.surface : Colors.surface;
  const iconColor = isDarkMode ? Colors.dark.text.primary : Colors.text.secondary;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: headerBg,
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.inner}>
        {/* Left: Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo-LiteX.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Right: Notifications */}
        <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
          <Ionicons name="notifications-outline" size={24} color={iconColor} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  inner: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  logoImage: {
    height: 38,
    width: 140, // Increased width to accommodate "Tajam Terpercaya"
  },
  bellButton: {
    padding: Spacing.xs,
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
    borderWidth: 1,
    borderColor: '#FFF',
  },
});

export default Header;
