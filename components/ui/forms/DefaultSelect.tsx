import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Styles, BorderRadius} from "../../../constants/design-system"

export type SelectOption = {
  label: string;
  value: string;
};

export function DefaultSelect({ 
  value, 
  onValueChange,
  data,
  placeholder = "Sortera"
}: { 
  value: string; 
  onValueChange: (value: string) => void;
  data: SelectOption[];
  placeholder?: string;
}) {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={[Styles.bodyM, styles.placeholderStyle]}
      selectedTextStyle={[Styles.bodyM, styles.selectedTextStyle]}
      containerStyle={styles.containerStyle}
      itemTextStyle={[Styles.bodyM, styles.itemTextStyle]}
      itemContainerStyle={styles.itemContainerStyle} 
      activeColor="#f0f0f0"
      data={data}
      labelField="label"
      valueField="value"
      placeholder={placeholder}
      value={value}
      onChange={item => onValueChange(item.value)}
      renderRightIcon={() => (
        <Ionicons name="swap-vertical" size={15} color={Colors.details} />


       
      )}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: Colors.details,
    borderRadius: BorderRadius.m,
    paddingHorizontal: 24,
    backgroundColor: Colors.secondary,
  },
  placeholderStyle: {
    color: Colors.details,
  },
  selectedTextStyle: {
    color: Colors.details,
  },
  containerStyle: {
    borderRadius: BorderRadius.m,
    borderWidth: 1,
    borderColor: Colors.light,
    marginTop: 4,
  },
  itemTextStyle: {
    color: Colors.details,
  },
  itemContainerStyle: {
    borderRadius: BorderRadius.m, 
  }
});