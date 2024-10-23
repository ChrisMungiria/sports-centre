"use server";

import { createClient } from "@/utils/supabase/server";

// Schema
import { CategorySchema } from "@/schemas";

// Zod
import { z } from "zod";

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

export const addCategory = async (values: z.infer<typeof CategorySchema>) => {
  // Validate the values on the server side
  const validatedValues = CategorySchema.safeParse(values);
  if (validatedValues.error) {
    console.log("Validation Error: ", validatedValues.error);
    return {
      error: "Error validating fields",
    };
  }

  const { icon, title } = validatedValues.data;

  try {
    // Create a supabase client
    const supabase = createClient();

    // Add the category to the database
    const { error } = await supabase.from("Category").insert({
      icon,
      title,
    });

    // If there is an error return the error
    if (error) {
      console.log("Error: ", error);
      return {
        error: " Error adding a category",
      };
    }

    // If there is no error return a success
    return {
      success: true,
    };
  } catch (error) {
    console.log("Error in addCategoryAction function: ", { error });
    return {
      error: "An unexpected error occurred",
    };
  }
};
