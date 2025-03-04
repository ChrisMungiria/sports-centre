"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Supabase
import { createClient } from "@/utils/supabase/server";

// Zod
import { z } from "zod";

// Schema
import { LoginSchema, RegisterSchema } from "@/schemas/index";
import { User } from "@supabase/supabase-js";

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function login(values: z.infer<typeof LoginSchema>) {
  try {
    // Validate the values
    const validatedValues = LoginSchema.safeParse(values);
    if (validatedValues.error) {
      console.log("Validation Error: ", validatedValues.error);
      return {
        error: "Error validating fields",
      };
    }

    const { email, password } = validatedValues.data;

    // Create a supabase client
    const supabase = createClient();

    // Log the user in
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If there is an error return the error
    if (loginError) {
      // If the credentials are invalid
      if (loginError.code == "invalid_credentials") {
        return {
          error: "Invalid email or password",
        };
      }
      return {
        error: "Error logging the user in",
      };
    }

    revalidatePath("/", "layout");

    // Indicate success
    return { success: true };
  } catch (error) {
    console.log("Error in login function: ", { error });
    return {
      error: "An unexpected error occurred",
    };
  }
}

export async function loginWithGoogleAction() {
  // initialize supabase
  const supabase = createClient();

  // Create the callbackURL depending on the environment
  const callbackURL =
    process.env.NODE_ENV === "production"
      ? "https://sports-centre.vercel.app/auth/callback"
      : "http://localhost:3000/auth/callback";

  console.log("environment: ", process.env.NODE_ENV);

  // Create the data object with the callback url
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackURL,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.log("Could not log in with Google :", error);
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function signup(values: z.infer<typeof RegisterSchema>) {
  try {
    // Validate the values
    const validatedValues = RegisterSchema.safeParse(values);
    if (validatedValues.error) {
      console.log("Validation Error: ", validatedValues.error);
      return {
        error: "Error validating fields",
      };
    }

    const { email, password, confirmPassword, fullname } = validatedValues.data;

    if (password !== confirmPassword) {
      return {
        error: "Passwords do not match",
      };
    }

    // Create a supabase client
    const supabase = createClient();

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: fullname,
        },
      },
    });

    // Handle sign-up errors
    if (signupError) {
      console.error("Signup Error:", signupError);
      if (signupError.message.includes("already registered")) {
        return { error: "User with this email already exists" };
      }
      return { error: "Error signing up. Please try again." };
    }

    revalidatePath("/", "layout");
    // Indicate success
    return { success: true };
  } catch (error) {
    console.log("Error in signup function: ", { error });
    return {
      error: "An unexpected error occurred",
    };
  }
}

export const addUserToDatabase = async (user: User) => {
  // Create a supabase client
  const supabase = createClient();

  const uid = user.id;
  const email = user.email;
  const display_name = user.user_metadata.display_name
    ? user.user_metadata.display_name
    : user.user_metadata.full_name;

  // Check if the user already exists in the database
  const { data } = await supabase.from("Users").select("*").eq("id", uid!);

  if (data && data.length > 0) {
    return;
  }

  try {
    await supabase.from("Users").insert({
      id: uid,
      email: email!,
      display_name,
    });
  } catch (error) {
    console.log("Error adding user to database: ", error);
  }
};
