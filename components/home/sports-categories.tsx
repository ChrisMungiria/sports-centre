"use client";

// Actions
import { fetchAllCategories } from "@/actions/category";

// React
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Components
import { Button } from "../ui/button";

// Props
type SportsCategoriesProps = {
  selectedCategory: Category | null | undefined;
  setSelectedCategory: Dispatch<SetStateAction<Category | null | undefined>>;
};

const SportsCategories = ({
  selectedCategory,
  setSelectedCategory,
}: SportsCategoriesProps) => {
  const [categories, setCategories] = useState<Category[] | null>();
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllCategoriesFn = async () => {
    try {
      const data = await fetchAllCategories();
      if (data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.log("Error fetching categories in client component: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategoriesFn();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex items-center gap-2">
      {categories ? (
        categories.map((category, index) => (
          <Button
            key={index}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => {
              setSelectedCategory(category);
            }}
          >
            {category.icon} {category.title}
          </Button>
        ))
      ) : (
        <p className="text-xs text-slate-400 text-center">
          No categories in the database
        </p>
      )}
    </div>
  );
};

export default SportsCategories;
