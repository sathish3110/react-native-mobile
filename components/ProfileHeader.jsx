import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../assets/styles/profile.styles";
import { useAuthStore } from "../store/authStore";

export default function ProfileHeader() {
  const { user } = useAuthStore();
  return (
    <View style={styles.profileHeader}>
      <Image style={styles.profileImage} source={{ uri: user.profileImage }} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
}
