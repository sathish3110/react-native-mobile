import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";

// This is the root layout for the app. It uses the expo-router library to handle navigation and routing.

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/* The SafeAreaProvider component is used to provide a safe area context for the app. This is useful for devices with notches or rounded corners. */}
      <SafeScreen>
        {/* The SafeScreen component is a custom component that provides a safe area for the app. This is useful for devices with notches or rounded corners. */}

        <Stack screenOptions={{ headerShown: false }}>
          {/* The parent layout for the app. This is where you can add global components like a header or footer. */}
          {/* The index screen is the main screen of the app. This is where you can add your main content. */}
          {/* The (auth) layout is the authentication flow of the app. This is where you can add your login and signup screens. */}

          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}
