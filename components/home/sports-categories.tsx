"use client";

// React
import { Dispatch, SetStateAction, useEffect, useState } from "react";

// Actions
import { fetchAllCategories } from "@/actions/category";

// Components
import { Button } from "../ui/button";

// Props
type SportCategoriesProps = {
  selectedCategory: Category | undefined | null;
  setSelectedCategory: Dispatch<SetStateAction<Category | null | undefined>>;
};

const SportCategories = ({
  selectedCategory,
  setSelectedCategory,
}: SportCategoriesProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [allCategories, setAllCategories] = useState<Category[] | null>();
  const [error, setError] = useState<string | null>();

  const fetchCategoriesFn = async () => {
    try {
      const categories = await fetchAllCategories();
      console.log("Categories: ", categories.data);
      if (categories.data) {
        setAllCategories(categories.data);
      } else {
        setAllCategories(null);
      }
    } catch (error) {
      console.error("Failed to fetch categories: ", error);
      setError("Failed to fetch categories. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesFn();
  }, []);

  if (loading) {
    const blocks = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    return (
      <div className="flex items-center gap-2">
        {Array.from({ length: blocks }).map((_, index) => {
          return (
            <div
              key={index}
              className="h-10 w-32 bg-slate-200 animate-pulse rounded-md"
            ></div>
          );
        })}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="flex items-center gap-2 overflow-x-scroll">
      {allCategories
        ? allCategories.map((category, index) => (
            <Button
              key={index}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory(category);
              }}
            >
              <p className="text-nowrap text-sm">
                {category.icon} {category.title}
              </p>
            </Button>
          ))
        : null}
    </div>
  );
};

export default SportCategories;
