import { Tabs } from "expo-router";
import { Camera, QrCode, Brain, Archive, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../utils/ThemeProvider";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderColor: colors.border,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
      }}
    >
      {/* QR Scanner Tab */}
      <Tabs.Screen
        name="scanner"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => <Camera color={color} size={size} />,
        }}
      />

      {/* QR Generator Tab */}
      <Tabs.Screen
        name="generate"
        options={{
          title: "Generate",
          tabBarIcon: ({ color, size }) => <QrCode color={color} size={size} />,
        }}
      />

      {/* Puzzle Tab */}
      <Tabs.Screen
        name="puzzle"
        options={{
          title: "Puzzle",
          tabBarIcon: ({ color, size }) => <Brain color={color} size={size} />,
        }}
      />

      {/* History/Archive Tab */}
      <Tabs.Screen
        name="history"
        options={{
          title: "Archive",
          tabBarIcon: ({ color, size }) => (
            <Archive color={color} size={size} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />

      {/* Hide the index route */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}