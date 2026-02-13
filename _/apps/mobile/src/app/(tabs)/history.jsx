import React, { useCallback, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Trash2, Trophy, Calendar } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSolvedPuzzles } from "../../utils/puzzleStorage";
import AdBanner from "../../components/AdBanner";

export default function ArchiveScreen() {
  const insets = useSafeAreaInsets();
  const [solvedPuzzles, setSolvedPuzzles] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadSolved();
    }, []),
  );

  const loadSolved = async () => {
    const puzzles = await getSolvedPuzzles();
    setSolvedPuzzles(puzzles);
  };

  const handleClear = async () => {
    Alert.alert(
      "Clear Archive",
      "Are you sure you want to clear all solved puzzles? This will also reset your streak.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove([
              "puzzle_solved",
              "puzzle_streak",
              "puzzle_last_solved",
            ]);
            setSolvedPuzzles([]);
          },
        },
      ],
    );
  };

  const categoryColors = {
    Logic: "#8b5cf6",
    Math: "#3b82f6",
    Riddles: "#ec4899",
  };

  const renderItem = ({ item }) => {
    const categoryColor = categoryColors[item.category] || "#6b7280";

    return (
      <View
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: 6,
              }}
            >
              {item.question}
            </Text>
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: categoryColor + "20",
                borderRadius: 8,
                alignSelf: "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: categoryColor,
                }}
              >
                {item.category}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginBottom: 4,
              }}
            >
              <Trophy size={16} color="#f59e0b" />
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#f59e0b" }}
              >
                {item.streak}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Calendar size={14} color="#9ca3af" />
              <Text style={{ fontSize: 12, color: "#6b7280" }}>
                {new Date(item.solvedAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#f9fafb",
            padding: 12,
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#6b7280",
              marginBottom: 4,
            }}
          >
            Answer:
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "500",
              color: "#1f2937",
            }}
          >
            {item.answer}
          </Text>
        </View>
      </View>
    );
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
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "bold" }}>Archive</Text>
        {solvedPuzzles.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Trash2 size={24} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={solvedPuzzles}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 100,
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: "center" }}>
            <Trophy size={48} color="#d1d5db" />
            <Text
              style={{
                color: "#9ca3af",
                fontSize: 16,
                marginTop: 16,
                textAlign: "center",
              }}
            >
              No puzzles solved yet.{"\n"}Start solving to build your archive!
            </Text>
          </View>
        }
      />

      <AdBanner />
    </View>
  );
}
