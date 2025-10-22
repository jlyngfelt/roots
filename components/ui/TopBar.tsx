import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/design-system";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface TopBarProps {
  showBackButton?: boolean;
  showSettingsButton?: boolean;
  onBackPress?: () => void;
}

export function TopBar({
  showBackButton = true,
  showSettingsButton = false,
  onBackPress,
}: TopBarProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <Pressable onPress={handleBackPress} hitSlop={10}>
            <IconSymbol
              size={30}
              name="chevron.left"
              color={Colors.secondary}
            />
          </Pressable>
        )}
      </View>

      <View style={styles.centerContainer}>
        <IconSymbol size={32} name="leaf.fill" color={Colors.secondary} />
      </View>

      <View style={styles.rightContainer}>
        {showSettingsButton && (
          <Pressable onPress={() => router.push("/settings")} hitSlop={10}>
            <IconSymbol size={30} name="gearshape" color={Colors.secondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
    height: 110,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 50,
    alignItems: "flex-start",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightContainer: {
    width: 50,
    alignItems: "flex-end",
  },
});
