import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import styles from "../assets/styles/profile.styles";
import COLORS from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          logout();
          router.replace("/(auth)");
        },
        style: "destructive",
      },
    ]);
  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
