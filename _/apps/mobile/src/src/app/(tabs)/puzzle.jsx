import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Animated,
  Vibration,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Lightbulb, CheckCircle, Trophy, Flame, Send } from "lucide-react-native";
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

function PuzzleScreen() {
  const insets = useSafeAreaInsets();
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [canSolve, setCanSolve] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerState, setAnswerState] = useState("idle"); // idle | correct | wrong
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    setUserAnswer("");
    setAnswerState("idle");
  };

  const triggerShake = () => {
    Vibration.vibrate(400);
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const normalizeAnswer = (str) =>
    str.toLowerCase().trim().replace(/[^a-z0-9]/g, "");

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    const userNorm = normalizeAnswer(userAnswer);
    const correctNorm = normalizeAnswer(currentPuzzle.answer);

    // Check if user answer contains or matches the correct answer
    const isCorrect =
      userNorm === correctNorm ||
      userNorm.includes(correctNorm) ||
      correctNorm.includes(userNorm);

    if (isCorrect) {
      setAnswerState("correct");
      const result = await markPuzzleSolved(currentPuzzle);
      setStreak(result.streak);
      setShowAnswer(true);
      setCanSolve(false);
      Alert.alert(
        "Well Done! 🎉",
        `That's correct!\nStreak: ${result.streak} day${result.streak !== 1 ? "s" : ""}!`,
        [{ text: "Great!" }],
      );
    } else {
      setAnswerState("wrong");
      triggerShake();
      // Reset wrong state after 1.5 seconds
      setTimeout(() => setAnswerState("idle"), 1500);
    }
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

  const inputBorderColor =
    answerState === "correct"
      ? "#10b981"
      : answerState === "wrong"
      ? "#ef4444"
      : "#e5e7eb";

  const inputBgColor =
    answerState === "correct"
      ? "#f0fdf4"
      : answerState === "wrong"
      ? "#fef2f2"
      : "#f9fafb";

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
            <Text style={{ fontSize: 14, fontWeight: "600", color: categoryColor }}>
              {currentPuzzle.category}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Question Card */}
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
          <Text style={{ fontSize: 20, fontWeight: "600", lineHeight: 28, color: "#1f2937" }}>
            {currentPuzzle.question}
          </Text>
        </View>

        {/* Answer Input — only show if not yet solved */}
        {canSolve && !showAnswer && (
          <Animated.View
            style={{
              transform: [{ translateX: shakeAnim }],
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
              Your Answer
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: inputBgColor,
                  borderWidth: 2,
                  borderColor: inputBorderColor,
                  borderRadius: 12,
                  padding: 14,
                  fontSize: 16,
                  color: "#1f2937",
                }}
                placeholder="Type your answer here..."
                placeholderTextColor="#9ca3af"
                value={userAnswer}
                onChangeText={setUserAnswer}
                onSubmitEditing={handleSubmitAnswer}
                returnKeyType="done"
                editable={answerState !== "correct"}
              />
              <TouchableOpacity
                onPress={handleSubmitAnswer}
                style={{
                  backgroundColor: answerState === "wrong" ? "#ef4444" : "#8b5cf6",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Send size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            {answerState === "wrong" && (
              <Text style={{ color: "#ef4444", fontSize: 13, marginTop: 6, marginLeft: 2 }}>
                Not quite — try again or use a hint!
              </Text>
            )}
          </Animated.View>
        )}

        {/* Hint toggle — hide after solved */}
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
            <Text style={{ fontSize: 16, fontWeight: "600", color: showHint ? "#fbbf24" : "#6b7280", flex: 1 }}>
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

        {/* Answer reveal */}
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
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#d1fae5", marginBottom: 8 }}>
                ANSWER
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 12 }}>
                {currentPuzzle.answer}
              </Text>
              <Text style={{ fontSize: 16, color: "#d1fae5", lineHeight: 24 }}>
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
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#92400e", marginTop: 8 }}>
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

export default PuzzleScreen;