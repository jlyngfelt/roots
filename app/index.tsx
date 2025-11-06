import { onAuthChange } from "@/auth";
import { Colors } from "@/constants/design-system";
import { getUserProfile } from "@/services/userService";
import { useRouter } from "expo-router";
import { User } from "firebase/auth";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function StartScreen() {
  const router = useRouter();

  useEffect(() => {
    let minLoadingComplete = false;
    let authResolved = false;
    let authResult: { user: User | null; profile: any } | null = null;

    setTimeout(() => {
      minLoadingComplete = true;
      if (authResolved) {
        navigate(authResult);
      }
    }, 300000);

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
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/roots_logo.png")}
        style={{ width: 300 }}
        resizeMode="contain"
      />
      <FlyingBee />
    </View>
  );
}

function FlyingBee() {
  // Shared values for animation
  const translateX = useSharedValue(-150);
  const translateY = useSharedValue(0);
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);

  useEffect(() => {
    // Bee flying forward with restart
    translateX.value = withRepeat(
      withSequence(
        withTiming(150, {
          duration: 3000,
          easing: Easing.linear, // Smooth continuous forward motion
        }),
        withTiming(-100, { duration: 0 }) // Instant reset to start
      ),
      -1,
      false
    );

    // Vertical movement (smoother, continuous wave with 2 waves)
    translateY.value = withRepeat(
      withSequence(
        withTiming(-25, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(25, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(25, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Trail lines with staggered fade
    opacity1.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 300 }),
        withTiming(0, { duration: 700 })
      ),
      -1,
      false
    );

    opacity2.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 150 }),
        withTiming(0.6, { duration: 300 }),
        withTiming(0, { duration: 550 })
      ),
      -1,
      false
    );

    opacity3.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 300 }),
        withTiming(0.4, { duration: 300 }),
        withTiming(0, { duration: 400 })
      ),
      -1,
      false
    );
  }, []);

  const beeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const trail1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - 20 },
      { translateY: translateY.value },
    ],
    opacity: opacity1.value,
  }));

  const trail2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - 35 },
      { translateY: translateY.value },
    ],
    opacity: opacity2.value,
  }));

  const trail3Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value - 50 },
      { translateY: translateY.value },
    ],
    opacity: opacity3.value,
  }));

  return (
    <View style={styles.beeContainer}>
      {/* Trail lines */}
      <Animated.View style={[styles.trailLine, trail3Style]} />
      <Animated.View style={[styles.trailLine, trail2Style]} />
      <Animated.View style={[styles.trailLine, trail1Style]} />

      {/* The bee */}
      <Animated.Image
        source={require("../assets/bee.png")}
        style={[styles.bee, beeStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },
  beeContainer: {
    width: 250,
    height: 10,
    marginTop: -80,
    justifyContent: "center",
    alignItems: "center",
  },
  bee: {
    width: 40,
    height: 40,
    position: "absolute",
  },
  trailLine: {
    width: 15,
    height: 2,
    backgroundColor: Colors.text,
    borderRadius: 2,
    position: "absolute",
  },
});
