// här kommer laddningssidan vara, här ska vi kolla om anv är inloggad, då skicaks den till tabs, annars till welcome

// eventuellt lägga en mer smooth animation??

import { onAuthChange } from "@/auth";
import { getUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function StartScreen() {
  const [activeDot, setActiveDot] = useState(0);
  const router = useRouter();

  const loadingPlant = require("../assets/icons/loadingPlant.png");

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 400);

    const unsubscribe = onAuthChange(async (user: User | null) => {
      setTimeout(async () => {
        if (user) {
          const profile = await getUserProfile(user.uid);

          if (profile) {
            router.replace("/(tabs)/explore");
          } else {
            router.replace("/create-profile");
          }
        } else {
          router.replace("/welcome");
        }
      }, 2000);
    });

    return () => {
      clearInterval(loadingInterval);
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, color: "green" }}>ROOTS</Text>
      <View style={styles.dotsContainer}>
        <Image
          source={loadingPlant}
          style={[styles.dot, activeDot === 0 && styles.activeDot]}
        />
        <Image
          source={loadingPlant}
          style={[styles.dot, activeDot === 1 && styles.activeDot]}
        />
        <Image
          source={loadingPlant}
          style={[styles.dot, activeDot === 2 && styles.activeDot]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dot: {
    width: 15,
    height: 15,
    opacity: 0.3, // Inaktiv prick
  },
  activeDot: {
    opacity: 1, // Aktiv prick
  },
});
