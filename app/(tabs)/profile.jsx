import { View, Text } from "react-native";
import React from "react";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";

export default function profile() {
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
    </View>
  );
}
