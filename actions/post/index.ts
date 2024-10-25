"use server";
import { createClient } from "@/utils/supabase/server";

type PostData = {
  title: string | null;
  description: string | null;
  category: string | null;
  created_by: string;
  image?: string;
};

export const addPostAction = async (formData: FormData) => {
  const supabase = createClient();

  // Get the logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Authentication error:", userError);
    return { error: "Authentication failed" };
  }

  // Extract form data
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const imageFile = formData.get("image") as File | null;

  // Prepare post data
  const postData: PostData = {
    title,
    description,
    category,
    created_by: user.id,
  };

  // Handle image upload if present
  if (imageFile instanceof File) {
    const { data: imageData, error: uploadError } = await supabase.storage
      .from("post_images")
      .upload(`posts/${imageFile.name}`, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Image upload error:", uploadError);
      return { error: "Failed to upload image" };
    }

    postData.image = imageData.path;
  }

  // Insert post into database
  const { error: insertError } = await supabase.from("Posts").insert(postData);
  if (insertError) {
    console.error("Post insertion error:", insertError);
    return { error: "Failed to create post" };
  }

  return { success: true };
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
