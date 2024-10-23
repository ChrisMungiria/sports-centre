"use client";

// React
import { useState } from "react";

// Components
import SportsCategories from "@/components/home/sports-categories";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>();

  return (
    <>
      <SportsCategories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <h1>Blog List</h1>
    </>
  );
}
