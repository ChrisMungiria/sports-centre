"use server";

import { createClient } from "@/utils/supabase/server";

// Schema
import { CategorySchema } from "@/schemas";

// Zod
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const fetchAllCategories = async () => {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("Category").select();

    if (error) {
      console.error("Error fetching categories:", error);
      return {
        error: "Error fetching categories (server)",
      };
    }

    return {
      data,
    };
  } catch (error) {
    console.error("Unexpected error in fetchAllCategories:", error);
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

export const deleteCategory = async (rowID: number) => {
  // Check if there are posts within this category
  const hasPosts = await checkIfCategoryHasPosts(rowID);
  if (hasPosts) {
    console.log("Has posts, cannot delete");
    return {
      error: "Cannot delete category with posts",
    };
  }
  // Create a supabase client
  const supabase = createClient();
  await supabase.from("Category").delete().eq("id", rowID);
  revalidatePath("/", "layout");
};

export const fetchCategoryById = async (categoryId: number) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("Category")
    .select()
    .eq("id", categoryId);
  return data;
};

export const updateCategory = async (
  values: z.infer<typeof CategorySchema>,
  categoryId: number
) => {
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

    // Update the category in the db
    const { error } = await supabase
      .from("Category")
      .update({
        icon,
        title,
      })
      .eq("id", categoryId);

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

// Helper functions
async function checkIfCategoryHasPosts(categoryId: number) {
  try {
    // Create a supabase client
    const supabase = createClient();

    const { data } = await supabase
      .from("Posts")
      .select()
      .eq("category", categoryId);
    if (data) {
      if (data?.length > 0) {
        return true;
      }
      return false;
    }

    return false;
  } catch (error) {
    console.log("Error checking if category has posts: ", error);
  }
}
