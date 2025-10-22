
import { Dropdown } from 'react-native-element-dropdown';
import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getCategories } from '@/services/categoryService';
import { Category } from '@/interfaces';
import { AntDesign } from '@expo/vector-icons';

export function DefaultSelect({ 
  value, 
  onValueChange 
}: { 
  value: string; 
  onValueChange: (value: string) => void 
}) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getCategories();
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  const data = categories.map(cat => ({
    label: cat.name,
    value: cat.id
  }));

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      containerStyle={styles.containerStyle}
      itemTextStyle={styles.itemTextStyle}
      activeColor="#f0f0f0"
      data={data}
      labelField="label"
      valueField="value"
      placeholder="Välj kategori"
      value={value}
      onChange={item => onValueChange(item.value)}
      renderRightIcon={() => (
        <AntDesign name="down" size={20} color="#666" />
      )}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    width: 220,
    height: 48,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  containerStyle: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 4,
  },
  itemTextStyle: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 8,
  },
});