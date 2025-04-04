import { View, Text, Image } from "react-native";
import React from "react";
import styles from "../assets/styles/profile.styles";
import { useAuthStore } from "../store/authStore";
import { formatMemberSince } from "../lib/utils";

export default function ProfileHeader() {
  const { user } = useAuthStore();
  return (
    <View style={styles.profileHeader}>
      <Image style={styles.profileImage} source={user.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.date}>{formatMemberSince(user.createdAt)}</Text>
      </View>
    </View>
  );
}
