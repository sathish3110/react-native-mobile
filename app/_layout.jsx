import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
// This is the root layout for the app. It uses the expo-router library to handle navigation and routing.
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

export default function RootLayout() {
  const { checkAuth, user, token } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Check if the user is authenticated when the app loads
    checkAuth();
  }, []);

  useEffect(() => {
    const isAuthScreen = segments[0] === "(auth)";
    const isLoggedIn = !!user && !!token;
    if (isLoggedIn && isAuthScreen) {
      // If the user is logged in and on the auth screen, redirect to the home screen
      router.replace("/(tabs)");
    }
    if (!isLoggedIn && !isAuthScreen) {
      // If the user is not logged in and not on the auth screen, redirect to the auth screen
      router.replace("/(auth)");
    }
  }, [user, token, segments]);
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
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
