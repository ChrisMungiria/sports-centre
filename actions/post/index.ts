"use server";
import { PostSchema } from "@/schemas";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export const addPostAction = async (values: z.infer<typeof PostSchema>) => {
  // Parse the data on the server
  const validatedValues = PostSchema.safeParse(values);
  if (!validatedValues.success) {
    console.log("The error: ", validatedValues.error);
    return {
      error: "Error validating values",
    };
  }

  const { category, description, title } = validatedValues.data;

  // Create the supabase client
  const supabase = createClient();

  // Get the logged in user id
  const user = await supabase.auth.getUser();

  // Try adding the data to the db
  try {
    if (!user.data.user) {
      return {
        error: "No user logged in",
      };
    }
    const { error } = await supabase.from("Posts").insert({
      title,
      description,
      category,
      created_by: user.data.user.id,
    });
    console.log("Error: ", error);

    return {
      success: true,
    };
  } catch (error) {
    console.log("Error adding post: ", error);
    return {
      error: "An unexpected error occurred",
    };
  }
};

export const fetchAllPosts = async () => {
  // Create the supabase client
  const supabase = createClient();

  try {
    const { data } = await supabase.from("Posts").select();

    return {
      data,
    };
  } catch (error) {
    console.log("Error fetching all posts in server component: ", error);
    return {
      error: "An unexpected error occurred while fetching posts",
    };
  }
};
