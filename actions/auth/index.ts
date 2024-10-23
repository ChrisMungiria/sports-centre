"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Supabase
import { createClient } from "@/utils/supabase/server";

// Zod
import { z } from "zod";

// Schema
import { LoginSchema, RegisterSchema } from "@/schemas/index";

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

  // Create the data object with the callback url
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
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

    // Sign the user up
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    // If there is an error return the error
    if (signupError) {
      // If the user with the same email tries to sign up return an error
      if (signupError.code == "user_already_exists") {
        return {
          error: "User with this email already exists",
        };
      }
      return {
        error: "Error signing user up",
      };
    }

    // Update the user's displayname
    const { error: displaynameError } = await supabase.auth.updateUser({
      data: {
        display_name: fullname,
      },
    });

    // If there is an error return the error
    if (displaynameError) {
      return {
        error: "Error updating the display name",
      };
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
