import { Category } from "@/interfaces";
import { getCategories } from "@/services/categoryService";
import { useEffect, useState } from "react";
import { DefaultSelect } from "../selects/DefaultSelect";

export function CategorySelect({
  value,
  onValueChange,
  placeholder = "Välj kategori",
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

  const data = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  return (
    <DefaultSelect
      value={value}
      onValueChange={onValueChange}
      data={data}
      placeholder={placeholder}
    />
  );
}
