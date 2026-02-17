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
        sound: "default",
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
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
    await Notifications.cancelAllScheduledNotificationsAsync();

    let trigger;
    if (Platform.OS === "android") {
      const now = new Date();
      const next9AM = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        9, 0, 0
      );

      // If it's already past 9 AM today, schedule for tomorrow
      if (now > next9AM) {
        next9AM.setDate(next9AM.getDate() + 1);
      }

      // Calculate seconds until next 9 AM
      const secondsUntilNext9AM = Math.round((next9AM.getTime() - now.getTime()) / 1000);

      trigger = {
        type: "time",
        seconds: secondsUntilNext9AM,
        repeats: true,        // repeat every interval
      };
    } else {
      // iOS calendar trigger
      trigger = {
        type: "calendar",
        hour: 9,
        minute: 0,
        repeats: true,
      };
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🧠 New Brain Teaser Available!",
        body: "Your daily puzzle is ready. Can you solve it?",
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    return true;
  } catch (error) {
    console.error("Error scheduling notification:", error);
    return false;
  }
};

