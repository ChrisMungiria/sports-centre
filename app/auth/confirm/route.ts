import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const nextUrl = searchParams.get("next") ?? "/";

  // Ensure `next` is only a pathname, preventing duplicate domain issues
  const nextPath = new URL(nextUrl, request.url).pathname;

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = nextPath;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return NextResponse.redirect(redirectTo);
    }
  }

  // Redirect to error page if verification fails
  redirectTo.pathname = "/auth/auth-code-error";
  return NextResponse.redirect(redirectTo);
}
