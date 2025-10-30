import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Spacing, Styles } from "@/constants/design-system";
import { SearchInputProps } from "@/interfaces";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export const SearchInput = ({
  value,
  onChangeText,
  placeholder = "Sök...",
  debounceMs = 300,
}: SearchInputProps) => {
  const [localValue, setLocalValue] = useState(value);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onChangeText(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs]);

  // synka om
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue("");
    onChangeText("");
  };

  return (
    <View style={styles.container}>
      <IconSymbol
        name="magnifyingglass"
        size={20}
        color={Colors.details}
        style={styles.searchIcon}
      />

      <TextInput
        value={localValue}
        onChangeText={setLocalValue}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor={Colors.details}
      />

      {localValue.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <IconSymbol name="xmark.circle" size={20} color={Colors.details} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.details,
    paddingHorizontal: Spacing.m,
    paddingVertical: 12,
    backgroundColor: "transparent",
    width: "100%",
    position: "relative",
  },
  searchIcon: {
    marginRight: Spacing.s,
    paddingVertical: 0,
    marginVertical: 0,
  },
  input: {
    flex: 1,
    ...Styles.bodyM,
    color: Colors.details,
    padding: 0,
  },
  clearButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.s,
    position: "absolute",
    right: 12,
  },
});
