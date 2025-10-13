import { Platform, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

export default function ExploreScreen() {
  const router = useRouter();
  return (
    <>
      <Text style={{ fontSize: 50, padding: 40 }}>EXPLORE</Text>
    </>
  );
}

const styles = StyleSheet.create({});
