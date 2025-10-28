import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { getCategories } from '@/services/categoryService';
import { Category } from '@/interfaces';
import { AntDesign } from '@expo/vector-icons';
import { Colors, Styles, BorderRadius} from "../../../constants/design-system"

export function CategorySelect({ 
  value, 
  onValueChange,
  placeholder = "Välj kategori"
}: { 
  value: string; 
  onValueChange: (value: string) => void;
  placeholder?: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCats() {
      const cats = await getCategories();
      setCategories(cats);
    }
    fetchCats();
  }, []);

  const data = categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }));

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
        <AntDesign name="down" size={15} color={Colors.details} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    width: "100%",
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