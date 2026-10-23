import React, { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Bell, Trophy, Flame, Award, Flag } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStreak, getSolvedPuzzles } from "../../utils/puzzleStorage";
import {
  requestNotificationPermissions,
  scheduleDailyNotification,
  cancelDailyNotification,
} from "../../utils/notifications";
import AdBanner from "../../components/AdBanner";
import { ThemedText as Text, useTheme } from "../../utils/ThemeProvider";

const NOTIFICATION_ENABLED_KEY = "notifications_enabled";

function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, preference, setPreference } = useTheme();
  const [streak, setStreak] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, []),
  );

  const loadStats = async () => {
    const currentStreak = await getStreak();
    const solved = await getSolvedPuzzles();
    setStreak(currentStreak);
    setTotalSolved(solved.length);

    const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    setNotificationsEnabled(enabled === "true");
  };

  const handleToggleNotifications = async (value) => {
    if (value) {
      try {
        const permission = await requestNotificationPermissions();
        if (!permission.granted) {
          Alert.alert(
            "Notifications unavailable",
            permission.canAskAgain
              ? "Notification permission is required to schedule the 9 AM reminder."
              : Platform.OS === "web"
                ? "Daily reminders are not available in this browser. Enable them in the mobile app."
                : "Notifications are blocked in system settings. Enable them there to receive the daily reminder.",
            permission.canAskAgain || Platform.OS === "web"
              ? [{ text: "OK" }]
              : [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Open Settings",
                    onPress: () => Linking.openSettings(),
                  },
                ],
          );
          return;
        }

        await scheduleDailyNotification();
        await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, "true");
        setNotificationsEnabled(true);
        Alert.alert(
          "Notifications Enabled",
          "Your daily quiz reminder is scheduled for 9 AM local time. Delivery can vary with device settings.",
        );
      } catch (error) {
        console.error("Unable to enable daily reminder:", error);
        Alert.alert(
          "Reminder could not be scheduled",
          "Please check your notification settings and try again.",
        );
      }
    } else {
      try {
        await cancelDailyNotification();
        await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, "false");
        setNotificationsEnabled(false);
      } catch (error) {
        console.error("Unable to cancel daily reminder:", error);
        Alert.alert(
          "Reminder could not be canceled",
          "Please try again. Your reminder setting has not been changed.",
        );
      }
    }
  };

  const handleReportAd = () => {
    Alert.alert(
      "Report Inappropriate Ad",
      "If you saw an inappropriate advertisement, please describe it in an email to our support team. We take ad quality seriously and will report it to Google AdMob immediately.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Email",
          onPress: () => {
            Linking.openURL(
              "mailto:aminuashraf55@gmail.com?subject=Inappropriate Ad Report&body=Please describe the ad you saw, including when and where it appeared in the app."
            );
          },
        },
      ]
    );
  };

  const getStreakBadge = () => {
    if (streak >= 30) return "🏆 Legend";
    if (streak >= 14) return "🔥 On Fire";
    if (streak >= 7) return "⭐ Week Warrior";
    if (streak >= 3) return "✨ Getting Started";
    return "🌱 Beginner";
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colors.statusBar} />

      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 15,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>Profile</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        <View
          style={{
            backgroundColor: "#8b5cf6",
            padding: 24,
            borderRadius: 16,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#fff",
              marginBottom: 20,
            }}
          >
            Your Stats
          </Text>

          <View style={{ gap: 16 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.surface,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Flame size={24} color="#f97316" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: "#e9d5ff" }}>
                  Current Streak
                </Text>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}
                >
                  {streak} days
                </Text>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Trophy size={24} color="#f59e0b" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: "#e9d5ff" }}>
                  Puzzles Solved
                </Text>
                <Text
                  style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}
                >
                  {totalSolved}
                </Text>
              </View>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Award size={24} color="#8b5cf6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, color: "#e9d5ff" }}>Badge</Text>
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", color: "#fff" }}
                >
                  {getStreakBadge()}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Card */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Settings</Text>
          </View>

          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
              Appearance
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[
                ["light", "Light"],
                ["dark", "Dark"],
                ["system", "System"],
              ].map(([value, label]) => (
                <TouchableOpacity
                  key={value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: preference === value }}
                  onPress={() => {
                    setPreference(value).catch((error) => {
                      console.error("Unable to save theme preference:", error);
                      Alert.alert(
                        "Theme could not be saved",
                        "Please try changing the appearance setting again.",
                      );
                    });
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor:
                      preference === value
                        ? colors.primary
                        : colors.surfaceSecondary,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color:
                        preference === value ? "#ffffff" : colors.primaryText,
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Bell size={24} color={colors.secondaryText} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  Daily Reminder
                </Text>
                <Text style={{ fontSize: 14, color: colors.secondaryText }}>
                  Get notified at 9 AM
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: "#d1d5db", true: "#c4b5fd" }}
              thumbColor={notificationsEnabled ? "#8b5cf6" : "#f3f4f6"}
            />
          </View>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              gap: 12,
            }}
            onPress={handleReportAd}
          >
            <Flag size={24} color={colors.secondaryText} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Report Inappropriate Ad
              </Text>
              <Text style={{ fontSize: 14, color: colors.secondaryText }}>
                Help us maintain ad quality
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Achievement Badges Info */}
        <View
          style={{
            backgroundColor: colors.surface,
            padding: 20,
            borderRadius: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 16,
            }}
          >
            Achievement Badges
          </Text>
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 14, color: colors.secondaryText }}>
              🌱 Beginner - Start your journey
            </Text>
            <Text style={{ fontSize: 14, color: colors.secondaryText }}>
              ✨ Getting Started - 3 day streak
            </Text>
            <Text style={{ fontSize: 14, color: colors.secondaryText }}>
              ⭐ Week Warrior - 7 day streak
            </Text>
            <Text style={{ fontSize: 14, color: colors.secondaryText }}>
              🔥 On Fire - 14 day streak
            </Text>
            <Text style={{ fontSize: 14, color: colors.secondaryText }}>
              🏆 Legend - 30 day streak
            </Text>
          </View>
        </View>
      </ScrollView>

      <AdBanner />
    </View>
  );
}
export default ProfileScreen;