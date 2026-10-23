jest.mock(
  "@react-native-async-storage/async-storage",
  () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loadThemePreference,
  resolveTheme,
  saveThemePreference,
  THEME_STORAGE_KEY,
} from "../theme";

beforeEach(async () => {
  await AsyncStorage.clear();
});

it("follows the system scheme when system appearance is selected", () => {
  expect(resolveTheme("system", "dark")).toBe("dark");
  expect(resolveTheme("system", "light")).toBe("light");
  expect(resolveTheme("light", "dark")).toBe("light");
});

it("persists the user's appearance setting across app launches", async () => {
  await saveThemePreference("dark");
  expect(await AsyncStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  expect(await loadThemePreference()).toBe("dark");
});

it("uses system appearance when no valid preference exists", async () => {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, "invalid");
  expect(await loadThemePreference()).toBe("system");
});
