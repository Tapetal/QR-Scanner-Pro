jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  getAllScheduledNotificationsAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  AndroidImportance: { HIGH: 4 },
  SchedulableTriggerInputTypes: { DAILY: "daily" },
}));

jest.mock(
  "@react-native-async-storage/async-storage",
  () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  cancelDailyNotification,
  scheduleDailyNotification,
} from "../notifications";

let scheduled;
let nextId;

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
  scheduled = [];
  nextId = 0;
  Notifications.getPermissionsAsync.mockResolvedValue({ granted: true });
  Notifications.getAllScheduledNotificationsAsync.mockImplementation(
    async () => scheduled,
  );
  Notifications.cancelScheduledNotificationAsync.mockImplementation(
    async (identifier) => {
      scheduled = scheduled.filter(
        (notification) => notification.identifier !== identifier,
      );
    },
  );
  Notifications.scheduleNotificationAsync.mockImplementation(
    async (request) => {
      const identifier = `daily-${++nextId}`;
      scheduled.push({ identifier, ...request });
      return identifier;
    },
  );
});

it("schedules a repeating local 9 AM trigger instead of an immediate notification", async () => {
  await scheduleDailyNotification();

  expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
    expect.objectContaining({
      trigger: expect.objectContaining({
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      }),
    }),
  );
  expect(scheduled).toHaveLength(1);
});

it("replaces its own scheduled reminder without canceling unrelated notifications", async () => {
  scheduled.push({
    identifier: "other",
    content: { data: { kind: "other" } },
  });

  await scheduleDailyNotification();
  await scheduleDailyNotification();

  expect(scheduled).toHaveLength(2);
  expect(scheduled.filter((item) => item.content.data?.kind === "daily-puzzle-reminder"))
    .toHaveLength(1);
  expect(scheduled.some((item) => item.identifier === "other")).toBe(true);
});

it("cancels only the daily reminder", async () => {
  scheduled.push({
    identifier: "daily-existing",
    content: { data: { kind: "daily-puzzle-reminder" } },
  });
  scheduled.push({
    identifier: "other",
    content: { data: { kind: "other" } },
  });

  await cancelDailyNotification();
  expect(scheduled.map((item) => item.identifier)).toEqual(["other"]);
});

it("does not schedule when notification permission is missing", async () => {
  Notifications.getPermissionsAsync.mockResolvedValue({ granted: false });

  await expect(scheduleDailyNotification()).rejects.toThrow(
    "Notification permission has not been granted.",
  );
  expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
});
