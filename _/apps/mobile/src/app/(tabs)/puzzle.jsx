import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AppState,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Lightbulb, CheckCircle, Trophy, Flame } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { puzzles } from "../../utils/puzzleData";
import {
  getDailyPuzzle,
  setDailyPuzzleHintVisible,
  markPuzzleSolved,
  getStreak,
} from "../../utils/puzzleStorage";
import { isPuzzleAnswerCorrect } from "../../utils/puzzleAnswers";
import AdBanner from "../../components/AdBanner";
import { ThemedText as Text, useTheme } from "../../utils/ThemeProvider";

function PuzzleScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [dailyDateKey, setDailyDateKey] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerInput, setAnswerInput] = useState("");
  const activePuzzleKey = useRef(null);
  const [streak, setStreak] = useState(0);
  const [canSolve, setCanSolve] = useState(true);

  const loadPuzzle = useCallback(async () => {
    try {
      const daily = await getDailyPuzzle(puzzles);
      const puzzleKey = `${daily.dateKey}:${daily.puzzle.id}`;
      if (activePuzzleKey.current !== puzzleKey) {
        activePuzzleKey.current = puzzleKey;
        setAnswerInput("");
      }
      setCurrentPuzzle(daily.puzzle);
      setDailyDateKey(daily.dateKey);

      const currentStreak = await getStreak();
      setStreak(currentStreak);

      const canSolveNow = !daily.completed;
      setCanSolve(canSolveNow);
      setShowHint(canSolveNow && daily.hintVisible);
      setShowAnswer(daily.completed);
    } catch (error) {
      console.error("Unable to load today's puzzle:", error);
      Alert.alert(
        "Puzzle unavailable",
        "The daily puzzle could not be loaded. Please try again.",
      );
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPuzzle();
    }, [loadPuzzle]),
  );

  useEffect(() => {
    const refreshOnReturn = AppState.addEventListener("change", (state) => {
      if (state === "active") loadPuzzle();
    });
    let timeout;
    const scheduleNextMidnightRefresh = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      timeout = setTimeout(() => {
        loadPuzzle();
        scheduleNextMidnightRefresh();
      }, midnight.getTime() - now.getTime());
    };
    scheduleNextMidnightRefresh();

    return () => {
      refreshOnReturn.remove();
      clearTimeout(timeout);
    };
  }, [loadPuzzle]);

  const toggleHint = async () => {
    const nextValue = !showHint;
    setShowHint(nextValue);
    if (dailyDateKey) {
      try {
        await setDailyPuzzleHintVisible(dailyDateKey, nextValue);
      } catch (error) {
        console.error("Unable to save puzzle progress:", error);
        Alert.alert("Progress could not be saved", "Please try again.");
      }
    }
  };

  const handleSolved = async () => {
    if (!canSolve) {
      Alert.alert("Already Solved", "Come back tomorrow for a new puzzle!");
      return;
    }

    try {
      const result = await markPuzzleSolved(currentPuzzle);
      setStreak(result.streak);
      setShowAnswer(true);
      setCanSolve(false);

      Alert.alert(
        "Well Done! 🎉",
        `Streak: ${result.streak} day${result.streak !== 1 ? "s" : ""}!`,
        [{ text: "Great!" }],
      );
    } catch (error) {
      console.error("Unable to save solved puzzle:", error);
      Alert.alert(
        "Progress could not be saved",
        "Your puzzle has not been marked complete. Please try again.",
      );
    }
  };

  const handleCheckAnswer = () => {
    if (!answerInput.trim()) {
      Alert.alert("Enter an answer", "Type your answer before checking it.");
      return;
    }

    if (!isPuzzleAnswerCorrect(answerInput, currentPuzzle.answer)) {
      Alert.alert("Not quite", "That answer is not correct yet. Try again!");
      return;
    }

    handleSolved();
  };

  if (!currentPuzzle) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={colors.statusBar} />
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
            backgroundColor: colors.surface,
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
              color: colors.primaryText,
            }}
          >
            {currentPuzzle.question}
          </Text>
        </View>

        {!showAnswer && (
          <TouchableOpacity
            onPress={toggleHint}
            style={{
              backgroundColor: colors.surface,
              padding: 16,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              borderWidth: 2,
              borderColor: showHint ? "#fbbf24" : colors.border,
            }}
          >
            <Lightbulb size={24} color={showHint ? "#fbbf24" : "#9ca3af"} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: showHint ? "#fbbf24" : colors.secondaryText,
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
              backgroundColor: colors.hintSurface,
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#fbbf24",
            }}
          >
            <Text style={{ fontSize: 16, color: colors.hintText, lineHeight: 24 }}>
              💡 {currentPuzzle.hint}
            </Text>
          </View>
        )}

        {!showAnswer && canSolve && (
          <View style={{ marginBottom: 20 }}>
            <TextInput
              value={answerInput}
              onChangeText={setAnswerInput}
              onSubmitEditing={handleCheckAnswer}
              returnKeyType="done"
              placeholder="Type your answer"
              placeholderTextColor={colors.mutedText}
              accessibilityLabel="Your answer"
              style={{
                backgroundColor: colors.surface,
                color: colors.primaryText,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 16,
                marginBottom: 12,
              }}
            />
            <TouchableOpacity
              onPress={handleCheckAnswer}
              style={{
                backgroundColor: "#10b981",
                padding: 18,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
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
                Check Answer
              </Text>
            </TouchableOpacity>
          </View>
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
                  backgroundColor: colors.warningSurface,
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
                    color: colors.hintText,
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
export default PuzzleScreen;