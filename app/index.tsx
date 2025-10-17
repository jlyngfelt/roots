// här kommer laddningssidan vara, här ska vi kolla om anv är inloggad, då skicaks den till tabs, annars till welcome

// eventuellt lägga en mer smooth animation??

import { onAuthChange } from "@/auth";
import { getUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function StartScreen() {
  const [activeDot, setActiveDot] = useState(0);
  const router = useRouter();

  const loadingPlant = require("../assets/icons/loadingPlant.png");

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 3);
    }, 400);

    let minLoadingComplete = false;
    let authResolved = false;
    let authResult: { user: User | null; profile: any } | null = null;

    // Minimum 2 second delay
    setTimeout(() => {
      minLoadingComplete = true;
      if (authResolved) {
        navigate(authResult);
      }
    }, 3000);

    // Auth check
    const unsubscribe = onAuthChange(async (user: User | null) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        authResult = { user, profile };
      } else {
        authResult = { user: null, profile: null };
      }

      authResolved = true;
      if (minLoadingComplete) {
        navigate(authResult);
      }
    });

    function navigate(result: { user: User | null; profile: any } | null) {
      console.log("Navigating from index...", result);
      clearInterval(loadingInterval);
      if (result?.user) {
        if (result.profile) {
          router.replace("/(tabs)/explore");
        } else {
          router.replace("/create-profile");
        }
      } else {
        router.replace("/welcome");
      }
    }

    return () => {
      clearInterval(loadingInterval);
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
      />
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
