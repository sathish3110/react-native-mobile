import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit this screen.</Text>
      <Link href="/(auth)">
        <Text>Go to Login</Text>
      </Link>
      <Link href="/(auth)/signup">
        <Text>Go to Signup</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "crimson",
  },
});
