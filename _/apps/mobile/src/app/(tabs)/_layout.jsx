import { Tabs } from "expo-router";
import { Camera, QrCode, Brain, Archive, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderColor: "#e5e7eb",
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 5,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#8b5cf6",
        tabBarInactiveTintColor: "#9ca3af",
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