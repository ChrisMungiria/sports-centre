"use server";

import { createClient } from "@/utils/supabase/server";

export const getLoggedInUser = async () => {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  return user;
};
