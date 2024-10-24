"use client";

// React
import { useState } from "react";

// Components
import SportsCategories from "@/components/home/sports-categories";
import BlogList from "@/components/home/blog-list";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>();

  return (
    <>
      <SportsCategories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <BlogList selectedCategory={selectedCategory} />
    </>
  );
}
