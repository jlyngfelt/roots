import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing } from "@/constants/design-system";
import { Pressable, StyleSheet, View } from "react-native";
import { FeedToggleProps } from "@/interfaces";

export function FeedToggle({ showAll, onToggle }: FeedToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable onPress={() => onToggle(true)}>
          <IconSymbol
            size={32}
            name={showAll ? "square.grid.2x2.fill" : "square.grid.2x2"}
            color={showAll ? Colors.accent : Colors.text}
          />
        </Pressable>

        <View style={styles.verticalDivider} />

        <Pressable onPress={() => onToggle(false)}>
          <IconSymbol
            size={32}
            name={!showAll ? "stroller.fill" : "stroller"}
            color={!showAll ? Colors.accent : Colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d9dfc9", // Slightly darker than secondary (#E2E8D7)
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 96,
    paddingVertical: Spacing.m,
  },
  verticalDivider: {
    width: 1.5,
    height: 32,
    backgroundColor: Colors.grey,
  },
});
