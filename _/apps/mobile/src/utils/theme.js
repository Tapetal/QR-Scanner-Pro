import AsyncStorage from "@react-native-async-storage/async-storage";

export const THEME_STORAGE_KEY = "app_theme_preference";

export const themePalettes = {
  light: {
    background: "#f9f9f9",
    surface: "#ffffff",
    surfaceSecondary: "#f3f4f6",
    primaryText: "#1f2937",
    secondaryText: "#6b7280",
    mutedText: "#9ca3af",
    border: "#e5e7eb",
    primary: "#8b5cf6",
    primarySoft: "#ede9fe",
    input: "#f9fafb",
    hintSurface: "#fffbeb",
    hintText: "#92400e",
    warningSurface: "#fef3c7",
    statusBar: "dark",
  },
  dark: {
    background: "#111827",
    surface: "#1f2937",
    surfaceSecondary: "#374151",
    primaryText: "#f9fafb",
    secondaryText: "#d1d5db",
    mutedText: "#9ca3af",
    border: "#374151",
    primary: "#a78bfa",
    primarySoft: "#4c1d95",
    input: "#111827",
    hintSurface: "#422006",
    hintText: "#fde68a",
    warningSurface: "#422006",
    statusBar: "light",
  },
};

export const resolveTheme = (preference, systemScheme) =>
  preference === "system" ? (systemScheme === "dark" ? "dark" : "light") : preference;

export const loadThemePreference = async () => {
  const preference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  return ["light", "dark", "system"].includes(preference)
    ? preference
    : "system";
};

export const saveThemePreference = async (preference) => {
  if (!["light", "dark", "system"].includes(preference)) {
    throw new Error(`Unsupported theme preference: ${preference}`);
  }
  await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
};
