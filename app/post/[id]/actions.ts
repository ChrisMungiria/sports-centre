"use server";

// Schema
import { CommentSchema } from "@/schemas";

// Supabase
import { createClient } from "@/utils/supabase/server";

// Next
import { revalidatePath } from "next/cache";

// Zod
import { z } from "zod";

export async function addComment(
  values: z.infer<typeof CommentSchema>,
  postId: string
) {
  const validatedValues = CommentSchema.safeParse(values);
  if (validatedValues.error) {
    console.log("Validation Error: ", validatedValues.error);
    return {
      error: "Error validating fields",
    };
  }
  const { comment } = validatedValues.data;

  // Create a supabase client
  const supabase = createClient();

  // Check if a user is logged in
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return {
      error: "No user logged in",
    };
  }

  // If there is a user logged in, add the comment to the post
  try {
    // Add the comment to the database
    const { error } = await supabase.from("Comment").insert({
      comment,
      created_by: user.data.user.id,
      post_id: parseInt(postId),
    });

    // If there is an error return the error
    if (error) {
      console.log("Error: ", error);
      return {
        error: " Error adding a comment",
      };
    }

    revalidatePath("/", "layout");

    // If there is no error return a success
    return {
      success: true,
    };
  } catch (error) {
    console.log("Error adding comment: ", error);
    return {
      error: "Error adding comment",
    };
  }
}
