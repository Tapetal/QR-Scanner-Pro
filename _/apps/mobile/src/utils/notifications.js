import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATION_ID_KEY = "daily_notification_id";
const NOTIFICATION_ENABLED_KEY = "notifications_enabled";
const DAILY_REMINDER_KIND = "daily-puzzle-reminder";
const ANDROID_CHANNEL_ID = "daily-puzzle";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const ensureAndroidChannel = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
      name: "Daily Puzzle Reminder",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }
};

export const requestNotificationPermissions = async () => {
  if (Platform.OS === "web") {
    return { granted: false, canAskAgain: false };
  }
  await ensureAndroidChannel();
  const currentPermissions = await Notifications.getPermissionsAsync();
  if (currentPermissions.granted) return currentPermissions;
  if (!currentPermissions.canAskAgain) return currentPermissions;
  return Notifications.requestPermissionsAsync();
};

const removeScheduledDailyReminders = async () => {
  const storedId = await AsyncStorage.getItem(NOTIFICATION_ID_KEY);
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const matching = scheduled.filter(
    (notification) =>
      notification.identifier === storedId ||
      notification.content.data?.kind === DAILY_REMINDER_KIND,
  );

  await Promise.all(
    matching.map((notification) =>
      Notifications.cancelScheduledNotificationAsync(notification.identifier),
    ),
  );
  await AsyncStorage.removeItem(NOTIFICATION_ID_KEY);
};

export const scheduleDailyNotification = async () => {
  if (Platform.OS === "web") {
    throw new Error("Local reminders are not available on web.");
  }
  await ensureAndroidChannel();
  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) {
    throw new Error("Notification permission has not been granted.");
  }

  await removeScheduledDailyReminders();
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your Daily Quiz Is Ready!",
      body: "Take a few minutes to challenge yourself with today's quiz.",
      sound: "default",
      data: { kind: DAILY_REMINDER_KIND },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 9,
      minute: 0,
      ...(Platform.OS === "android" ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
  });

  await AsyncStorage.setItem(NOTIFICATION_ID_KEY, id);
  return id;
};

export const cancelDailyNotification = async () => {
  await removeScheduledDailyReminders();
};

export const restoreDailyNotification = async () => {
  if (Platform.OS === "web") return false;
  const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
  if (enabled !== "true") return false;

  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) return false;
  await ensureAndroidChannel();

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const existing = scheduled.find(
    (notification) =>
      notification.content.data?.kind === DAILY_REMINDER_KIND,
  );
  if (existing) {
    await AsyncStorage.setItem(NOTIFICATION_ID_KEY, existing.identifier);
    return true;
  }

  await scheduleDailyNotification();
  return true;
};
