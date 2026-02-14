import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "qr_scan_history";
const MAX_HISTORY = 20;

export const addToHistory = async (scanData) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history = existing ? JSON.parse(existing) : [];
    
    const newEntry = {
      ...scanData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };
    
    // Keep last 20 scans
    const updated = [newEntry, ...history].slice(0, MAX_HISTORY);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    
    return updated;
  } catch (error) {
    console.error("Error saving to history:", error);
    return [];
  }
};

export const getHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error getting history:", error);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing history:", error);
    return false;
  }
};

export const deleteHistoryItem = async (id) => {
  try {
    const history = await getHistory();
    const filtered = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error("Error deleting history item:", error);
    return [];
  }
};