"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchCommentCreator = async (userID: string) => {
  const supabase = createClient();

  try {
    const { data } = await supabase
      .from("Users")
      .select("display_name")
      .eq("id", userID);
    if (!data) return;
    return {
      display_name: data[0].display_name,
    };
  } catch (error) {
    console.log("Failed to fetch the comment creator: ", error);
  }
};
