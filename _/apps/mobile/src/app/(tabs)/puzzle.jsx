import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Lightbulb, CheckCircle, Trophy, Flame } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { puzzles } from "../../utils/puzzleData";
import {
  getCurrentPuzzleIndex,
  markPuzzleSolved,
  getStreak,
  canSolveToday,
  incrementPuzzleIndex,
} from "../../utils/puzzleStorage";
import AdBanner from "../../components/AdBanner";

export default function PuzzleScreen() {
  const insets = useSafeAreaInsets();
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [canSolve, setCanSolve] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadPuzzle();
    }, []),
  );

  const loadPuzzle = async () => {
    const index = await getCurrentPuzzleIndex();
    const puzzleIndex = index % puzzles.length;
    setCurrentPuzzle(puzzles[puzzleIndex]);

    const currentStreak = await getStreak();
    setStreak(currentStreak);

    const canSolveNow = await canSolveToday();
    setCanSolve(canSolveNow);
    setShowHint(false);
    setShowAnswer(!canSolveNow);
  };

  const handleSolved = async () => {
    if (!canSolve) {
      Alert.alert("Already Solved", "Come back tomorrow for a new puzzle!");
      return;
    }

    const result = await markPuzzleSolved(currentPuzzle);
    setStreak(result.streak);
    setShowAnswer(true);
    setCanSolve(false);

    Alert.alert(
      "Well Done! 🎉",
      `Streak: ${result.streak} day${result.streak !== 1 ? "s" : ""}!`,
      [{ text: "Great!" }],
    );
  };

  const handleNextPuzzle = async () => {
    await incrementPuzzleIndex();
    loadPuzzle();
  };

  if (!currentPuzzle) {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar style="dark" />
      </View>
    );
  }

  const categoryColors = {
    Logic: "#8b5cf6",
    Math: "#3b82f6",
    Riddles: "#ec4899",
  };

  const categoryColor = categoryColors[currentPuzzle.category] || "#6b7280";

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
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>
          Daily Brain Teaser
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Flame size={20} color="#f97316" />
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {streak} day streak
            </Text>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
              backgroundColor: categoryColor + "20",
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: categoryColor,
              }}
            >
              {currentPuzzle.category}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 24,
            borderRadius: 16,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              lineHeight: 28,
              color: "#1f2937",
            }}
          >
            {currentPuzzle.question}
          </Text>
        </View>

        {!showAnswer && (
          <TouchableOpacity
            onPress={() => setShowHint(!showHint)}
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              borderWidth: 2,
              borderColor: showHint ? "#fbbf24" : "#e5e7eb",
            }}
          >
            <Lightbulb size={24} color={showHint ? "#fbbf24" : "#9ca3af"} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: showHint ? "#fbbf24" : "#6b7280",
                flex: 1,
              }}
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </Text>
          </TouchableOpacity>
        )}

        {showHint && !showAnswer && (
          <View
            style={{
              backgroundColor: "#fffbeb",
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#fbbf24",
            }}
          >
            <Text style={{ fontSize: 16, color: "#92400e", lineHeight: 24 }}>
              💡 {currentPuzzle.hint}
            </Text>
          </View>
        )}

        {!showAnswer && canSolve && (
          <TouchableOpacity
            onPress={handleSolved}
            style={{
              backgroundColor: "#10b981",
              padding: 18,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <CheckCircle size={24} color="#fff" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              I Solved It!
            </Text>
          </TouchableOpacity>
        )}

        {showAnswer && (
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                backgroundColor: "#10b981",
                padding: 20,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#d1fae5",
                  marginBottom: 8,
                }}
              >
                ANSWER
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#fff",
                  marginBottom: 12,
                }}
              >
                {currentPuzzle.answer}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#d1fae5",
                  lineHeight: 24,
                }}
              >
                {currentPuzzle.explanation}
              </Text>
            </View>

            {!canSolve && (
              <View
                style={{
                  backgroundColor: "#fef3c7",
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Trophy size={32} color="#f59e0b" />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#92400e",
                    marginTop: 8,
                  }}
                >
                  Come back tomorrow for a new puzzle!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <AdBanner />
    </View>
  );
}
