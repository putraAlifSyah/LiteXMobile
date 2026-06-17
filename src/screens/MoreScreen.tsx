import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Spacing, BorderRadius } from '../constants/spacing';
import { useSettingsStore } from '../store/settingsStore';

const APP_VERSION = '1.0.0';
const WEBSITE_URL = 'https://litex.co.id';
const EMAIL = 'redaksi@litex.co.id';

// ---------------------------------------------------------------------------
// Row Components
// ---------------------------------------------------------------------------

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  subtitle,
  right,
  onPress,
  isLast,
}) => {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={20} color={Colors.primary} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      {right ?? (
        onPress ? (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.text.disabled}
          />
        ) : null
      )}
    </Container>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

// ---------------------------------------------------------------------------
// More Screen
// ---------------------------------------------------------------------------

export const MoreScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, toggleDarkMode } = useSettingsStore();

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Brand Header ---- */}
        <View style={styles.brandSection}>
          <View style={styles.brandLogo}>
            <Text style={styles.brandText}>Lite</Text>
            <Text style={styles.brandAccent}>X</Text>
          </View>
          <Text style={styles.brandTagline}>Tajam Terpercaya</Text>
        </View>

        {/* ---- Pengaturan ---- */}
        <SectionHeader title="Pengaturan" />
        <View style={styles.card}>
          <SettingRow
            icon="moon-outline"
            label="Mode Gelap"
            subtitle="Tampilan lebih nyaman di malam hari"
            isLast
            right={
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{
                  false: Colors.border,
                  true: `${Colors.primary}80`,
                }}
                thumbColor={isDarkMode ? Colors.primary : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* ---- Tentang ---- */}
        <SectionHeader title="Tentang" />
        <View style={styles.card}>
          <SettingRow
            icon="information-circle-outline"
            label="Tentang LiteX"
            subtitle="Portal berita terpercaya Indonesia"
          />
          <SettingRow
            icon="globe-outline"
            label="Website"
            subtitle={WEBSITE_URL}
            onPress={() => openURL(WEBSITE_URL)}
          />
          <SettingRow
            icon="document-text-outline"
            label="Kebijakan Privasi"
            onPress={() => openURL(`${WEBSITE_URL}/kebijakan-privasi`)}
          />
          <SettingRow
            icon="shield-checkmark-outline"
            label="Syarat & Ketentuan"
            onPress={() => openURL(`${WEBSITE_URL}/syarat-ketentuan`)}
            isLast
          />
        </View>

        {/* ---- Hubungi Kami ---- */}
        <SectionHeader title="Hubungi Kami" />
        <View style={styles.card}>
          <SettingRow
            icon="mail-outline"
            label="Email Redaksi"
            subtitle={EMAIL}
            onPress={() => openURL(`mailto:${EMAIL}`)}
          />
          <SettingRow
            icon="logo-instagram"
            label="Instagram"
            subtitle="@litex.co.id"
            onPress={() =>
              openURL('https://instagram.com/litex.co.id')
            }
          />
          <SettingRow
            icon="logo-twitter"
            label="Twitter / X"
            subtitle="@litex_id"
            onPress={() => openURL('https://x.com/litex_id')}
          />
          <SettingRow
            icon="logo-facebook"
            label="Facebook"
            subtitle="LiteX News"
            onPress={() => openURL('https://facebook.com/litexnews')}
            isLast
          />
        </View>

        {/* ---- Footer ---- */}
        <View style={styles.footer}>
          <Text style={styles.footerVersion}>
            LiteX v{APP_VERSION}
          </Text>
          <Text style={styles.footerCopy}>
            © {new Date().getFullYear()} LiteX. All rights reserved.
          </Text>
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
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['4xl'],
  },
  // Brand
  brandSection: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  brandLogo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  brandText: {
    ...Typography.h1,
    color: Colors.secondary,
    fontWeight: '800',
  },
  brandAccent: {
    ...Typography.h1,
    color: Colors.primary,
    fontWeight: '800',
  },
  brandTagline: {
    ...Typography.body2,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  // Section
  sectionHeader: {
    ...Typography.overline,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.base,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    ...Typography.subtitle2,
    color: Colors.text.primary,
  },
  rowSubtitle: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  // Footer
  footer: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    paddingVertical: Spacing.base,
  },
  footerVersion: {
    ...Typography.caption,
    color: Colors.text.disabled,
    marginBottom: Spacing.xs,
  },
  footerCopy: {
    ...Typography.caption,
    color: Colors.text.disabled,
    fontSize: 10,
  },
});

export default MoreScreen;
