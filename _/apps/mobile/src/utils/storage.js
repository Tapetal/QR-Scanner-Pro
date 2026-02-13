import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "scan_history";
const MAX_HISTORY = 20;

export const getHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(HISTORY_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error reading history", e);
    return [];
  }
};

export const addToHistory = async (item) => {
  try {
    const currentHistory = await getHistory();
    const newItem = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...item,
    };

    // Add to top, limit to MAX_HISTORY
    const newHistory = [newItem, ...currentHistory].slice(0, MAX_HISTORY);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (e) {
    console.error("Error saving history", e);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return [];
  } catch (e) {
    console.error("Error clearing history", e);
  }
};
