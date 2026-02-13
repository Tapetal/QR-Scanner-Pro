import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermissions = async () => {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("daily-puzzle", {
        name: "Daily Puzzle Reminder",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: true,
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
};

export const scheduleDailyNotification = async () => {
  try {
    // Cancel any existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule daily notification at 9 AM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧠 New Brain Teaser Available!",
        body: "Your daily puzzle is ready. Can you solve it?",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    return true;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return false;
  }
};

export const cancelDailyNotification = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return true;
  } catch (error) {
    console.error("Error canceling notification:", error);
    return false;
  }
};
