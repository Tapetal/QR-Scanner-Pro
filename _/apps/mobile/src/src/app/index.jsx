import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to the scanner tab by default
  return <Redirect href="/(tabs)/scanner" />;
}