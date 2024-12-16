"use server";

import { createClient } from "@/utils/supabase/server";

export const checkUserRole = async () => {
  // Create the supabase client
  const supabase = createClient();
  // Get the current user
  const { data } = await supabase.auth.getUser();
  // Get the current UID
  const uid = data.user?.id;

  try {
    // Get the user data from the public users table
    const { data } = await supabase.from("Users").select().eq("id", uid!);
    if (!data) return;
    return data[0].role;
  } catch (error) {
    console.log("Error fetching the user role: ", error);
  }
};
