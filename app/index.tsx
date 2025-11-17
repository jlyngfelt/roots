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
  useDerivedValue,
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
    let hasNavigated = false;

    setTimeout(() => {
      minLoadingComplete = true;
      if (authResolved && !hasNavigated) {
        navigate(authResult);
      }
    }, 3000);

    const unsubscribe = onAuthChange(async (user: User | null) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        authResult = { user, profile };
      } else {
        authResult = { user: null, profile: null };
      }

      authResolved = true;
      if (minLoadingComplete && !hasNavigated) {
        navigate(authResult);
      }
    });

    function navigate(result: { user: User | null; profile: any } | null) {
      if (hasNavigated) return;
      hasNavigated = true;

      if (result?.user) {
        if (result.profile) {
          router.replace("/(tabs)/explore");
        } else {
          router.replace("/register/ProfileStep");
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
        style={{ height: 170, margin: 40 }}
        resizeMode="contain"
      />
      <FlyingBee />
    </View>
  );
}

export function FlyingBee() {
  const translateX = useSharedValue(-150);
  const progress = useSharedValue(0);
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(150, {
          duration: 4000,
          easing: Easing.linear,
        }),
        withTiming(-150, { duration: 0 })
      ),
      -1,
      false
    );

    progress.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

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

  const translateY = useDerivedValue(() => {
    const amplitude = 20;
    return Math.sin(progress.value) * amplitude;
  });

  const beeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const trailStyle = (offset: number, opacityValue: any) =>
    useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value - offset },
        { translateY: translateY.value },
      ],
      opacity: opacityValue.value,
    }));

  const trail1Style = trailStyle(20, opacity1);
  const trail2Style = trailStyle(35, opacity2);
  const trail3Style = trailStyle(50, opacity3);

  return (
    <View style={styles.beeContainer}>
      <Animated.View style={[styles.trailLine, trail3Style]} />
      <Animated.View style={[styles.trailLine, trail2Style]} />
      <Animated.View style={[styles.trailLine, trail1Style]} />
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
    width: 400,
    height: 100,
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  bee: {
    width: 40,
    height: 40,
    position: "absolute",
  },
  trailLine: {
    width: 15,
    height: 2,
    backgroundColor: Colors.grey,
    borderRadius: 2,
    position: "absolute",
  },
});