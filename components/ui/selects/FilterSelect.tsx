import { StyleSheet, View, Text, Pressable, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/categoryService';
import { Category, FilterSelectProps, FilterState, CheckboxItemProps, RadioItemProps } from '@/interfaces';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Colors, Styles, BorderRadius, Spacing } from "@/constants/design-system";

function CheckboxItem({ checked, onPress, label }: CheckboxItemProps) {
  return (
    <Pressable style={styles.checkboxItem} onPress={onPress}>
      <View style={styles.checkbox}>
        {checked && <AntDesign name="check" size={16} color={Colors.accent} />}
      </View>
      <Text style={[Styles.bodyM, styles.itemText]}>{label}</Text>
    </Pressable>
  );
}

function RadioItem({ selected, onPress, label }: RadioItemProps) {
  return (
    <Pressable style={styles.radioItem} onPress={onPress}>
      <View style={styles.radio}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[Styles.bodyM, styles.itemText]}>{label}</Text>
    </Pressable>
  );
}

export function FilterSelect({ 
  value, 
  onValueChange,
  placeholder = "Filter"
}: FilterSelectProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState<FilterState>(value);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setTempFilter(value);
  }, [value]);

  const handleApply = () => {
    onValueChange(tempFilter);
    setIsOpen(false);
  };

  const handleClose = () => {
    setTempFilter(value);
    setIsOpen(false);
  };

  const toggleReadyToAdopt = () => {
    setTempFilter(prev => ({ ...prev, readyToAdopt: !prev.readyToAdopt }));
  };

  const selectCategory = (categoryId: string) => {
    setTempFilter(prev => ({ ...prev, categoryId }));
  };

  const hasActiveFilters = () => {
  return tempFilter.readyToAdopt || tempFilter.categoryId !== "all";
};

  return (
    <>
      <Pressable style={[styles.dropdown, hasActiveFilters() && styles.dropdownActive]} onPress={() => setIsOpen(true)}>
        <Text style={[Styles.bodyM, styles.dropdownText, hasActiveFilters() && styles.dropdownTextActive]}>
          Filtrera
        </Text>
          <Ionicons name="filter" size={15} color={hasActiveFilters() ? Colors.accent : Colors.details} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
        >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            
            <CheckboxItem
              checked={tempFilter.readyToAdopt}
              onPress={toggleReadyToAdopt}
              label="Redo att adopteras"
              />

            <View style={styles.divider} />

            <Text style={[Styles.bodyM, styles.sectionTitle]}>Kategori</Text>
            
            <RadioItem
              selected={tempFilter.categoryId === "all"}
              onPress={() => selectCategory("all")}
              label="Alla"
              />

            {categories.map((category) => (
              <RadioItem
              key={category.id}
              selected={tempFilter.categoryId === category.id}
              onPress={() => selectCategory(category.id)}
              label={category.name}
              />
            ))}

            <Pressable style={styles.applyButton} onPress={handleApply}>
              <Text style={[Styles.bodyM, styles.applyButtonText]}>
                Tillämpa filter
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
  
            </>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    height: 46,
    borderWidth: 2,
    borderColor: Colors.details,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.l,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    color: Colors.details,
    fontWeight: "bold",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    width: "80%",
    maxHeight: "70%",
  },
  checkboxItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.s,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.details,
    borderRadius: BorderRadius.s,
    marginRight: Spacing.s,
    justifyContent: "center",
    alignItems: "center",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.s,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.details,
    borderRadius: BorderRadius.l,
    marginRight: Spacing.s,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.s,
    backgroundColor: Colors.accent,
  },
  itemText: {
    color: Colors.details,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light,
    marginVertical: Spacing.s,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: Colors.details,
    marginBottom: Spacing.xs,
  },
  applyButton: {
    backgroundColor: Colors.accent,
    padding: Spacing.s,
    borderRadius: BorderRadius.m,
    alignItems: "center",
    marginTop: Spacing.m,
  },
  applyButtonText: {
    color: Colors.secondary,
    fontWeight: "bold",
  },
  dropdownActive: {
  borderColor: Colors.accent,
  backgroundColor: Colors.accent + '10', 
},
dropdownTextActive: {
  color: Colors.accent,
},
});