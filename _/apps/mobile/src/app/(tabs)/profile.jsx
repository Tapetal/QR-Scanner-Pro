import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
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

const NOTIFICATION_ENABLED_KEY = "notifications_enabled";

function ProfileScreen() {
  const insets = useSafeAreaInsets();
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
      const hasPermission = await requestNotificationPermissions();
      if (hasPermission) {
        await scheduleDailyNotification();
        await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, "true");
        setNotificationsEnabled(true);
        Alert.alert(
          "Notifications Enabled",
          "You'll receive a daily reminder at 9 AM to solve your puzzle!",
        );
      } else {
        Alert.alert(
          "Permission Denied",
          "Please enable notifications in your device settings to receive daily reminders.",
        );
      }
    } else {
      await cancelDailyNotification();
      await AsyncStorage.setItem(NOTIFICATION_ENABLED_KEY, "false");
      setNotificationsEnabled(false);
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
              "mailto:support@qrscannerpro.com?subject=Inappropriate Ad Report&body=Please describe the ad you saw, including when and where it appeared in the app."
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
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <StatusBar style="dark" />

      <View
        style={{
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 15,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: "#f0f0f0",
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
                  backgroundColor: "#fff",
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
            backgroundColor: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#f0f0f0",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>Settings</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: "#f0f0f0",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Bell size={24} color="#6b7280" />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  Daily Reminder
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280" }}>
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
            <Flag size={24} color="#6b7280" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Report Inappropriate Ad
              </Text>
              <Text style={{ fontSize: 14, color: "#6b7280" }}>
                Help us maintain ad quality
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Achievement Badges Info */}
        <View
          style={{
            backgroundColor: "#fff",
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
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              🌱 Beginner - Start your journey
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              ✨ Getting Started - 3 day streak
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              ⭐ Week Warrior - 7 day streak
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
              🔥 On Fire - 14 day streak
            </Text>
            <Text style={{ fontSize: 14, color: "#6b7280" }}>
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