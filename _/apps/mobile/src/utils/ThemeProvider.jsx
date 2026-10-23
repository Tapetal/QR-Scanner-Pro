import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Appearance, Text, useColorScheme, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  loadThemePreference,
  resolveTheme,
  saveThemePreference,
  themePalettes,
} from "./theme";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState(null);
  const splashHidden = useRef(false);

  useEffect(() => {
    let isMounted = true;
    loadThemePreference()
      .then((storedPreference) => {
        if (isMounted) {
          setPreference(storedPreference);
        }
      })
      .catch((error) => {
        console.error("Unable to load theme preference:", error);
        if (isMounted) setPreference("system");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const themeName = resolveTheme(preference || "system", systemScheme);
  const colors = themePalettes[themeName];

  useEffect(() => {
    if (preference !== null) {
      Appearance.setColorScheme(preference === "system" ? null : themeName);
      if (!splashHidden.current) {
        splashHidden.current = true;
        SplashScreen.hideAsync().catch((error) => {
          console.error("Unable to hide the splash screen:", error);
        });
      }
    }
  }, [preference, themeName]);

  const value = useMemo(
    () => ({
      preference: preference || "system",
      themeName,
      colors,
      setPreference: async (nextPreference) => {
        await saveThemePreference(nextPreference);
        setPreference(nextPreference);
      },
    }),
    [colors, preference, themeName],
  );

  if (preference === null) {
    const initialScheme = systemScheme || Appearance.getColorScheme();
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:
            initialScheme === "dark"
              ? themePalettes.dark.background
              : themePalettes.light.background,
        }}
      />
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }
  return theme;
}

export function ThemedText({ style, ...props }) {
  const { colors } = useTheme();
  return <Text {...props} style={[{ color: colors.primaryText }, style]} />;
}
