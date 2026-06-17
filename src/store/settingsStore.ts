import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@litex/settings';

interface SettingsData {
  isDarkMode: boolean;
}

interface SettingsState extends SettingsData {
  isLoaded: boolean;
  toggleDarkMode: () => void;
  loadSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: SettingsData = {
  isDarkMode: false,
};

async function persistSettings(data: SettingsData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to persist settings:', error);
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  isLoaded: false,

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    set({ isDarkMode: next });
    persistSettings({ isDarkMode: next });
  },

  loadSettings: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: SettingsData = JSON.parse(raw);
        set({ ...parsed, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({ isLoaded: true });
    }
  },
}));
