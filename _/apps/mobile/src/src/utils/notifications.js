import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_ID_KEY = "daily_notification_id";

// 🔔 Handle foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ✅ Request permissions
export const requestNotificationPermissions = async () => {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily-puzzle", {
        name: "Daily Puzzle Reminder",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Permission error:", error);
    return false;
  }
};

// ✅ Schedule notification (saves ID)
export const scheduleDailyNotification = async () => {
  try {
    // Cancel any previous first
    await cancelDailyNotification();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧠 New Brain Teaser Available!",
        body: "Your daily puzzle is ready. Can you solve it?",
        sound: true,
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);

    return true;
  } catch (error) {
    console.error("Schedule error:", error);
    return false;
  }
};

// ✅ Cancel by stored ID (VERY IMPORTANT)
export const cancelDailyNotification = async () => {
  try {
    const id = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);

    if (id) {
      await Notifications.cancelScheduledNotificationAsync(id);
      await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
    }

    // Extra safety clear
    await Notifications.cancelAllScheduledNotificationsAsync();

    return true;
  } catch (error) {
    console.error("Cancel error:", error);
    return false;
  }
};
