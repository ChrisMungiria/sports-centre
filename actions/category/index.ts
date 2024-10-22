"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchAllCategories = async () => {
  try {
    const supabase = createClient();

    const { data } = await supabase.from("Category").select();

    return {
      data,
    };
  } catch (error) {
    console.log("Error in fetchCategories: ", error);
    return {
      error: "An unexpected error occurred",
    };
  }
};
