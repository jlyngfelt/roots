import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/design-system";
import { Pressable, StyleSheet, View } from "react-native";

interface FeedToggleProps {
  showAll: boolean;
  onToggle: (showAll: boolean) => void;
}

export function FeedToggle({ showAll, onToggle }: FeedToggleProps) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable onPress={() => onToggle(true)}>
        <IconSymbol
          size={32}
          name={showAll ? "square.grid.2x2.fill" : "square.grid.2x2"}
          color={showAll ? Colors.accent : Colors.text}
        />
      </Pressable>

      <Pressable onPress={() => onToggle(false)}>
        <IconSymbol
          size={32}
          name={!showAll ? "stroller.fill" : "stroller"}
          color={!showAll ? Colors.accent : Colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 96,
    marginVertical: 24,
  },
});
