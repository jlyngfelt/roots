import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Styles } from "@/constants/design-system";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { SearchInputProps } from "@/interfaces";

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
      {/* Sök-ikon till vänster */}
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
          <IconSymbol 
            name="xmark.circle.fill" 
            size={20} 
            color={Colors.details} 
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.details,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "transparent",
    width: "100%",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...Styles.bodyM,
    color: Colors.details,
    padding: 0, // Ta bort default padding
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});