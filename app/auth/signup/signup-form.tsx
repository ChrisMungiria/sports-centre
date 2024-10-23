"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Form Items
import { useForm } from "react-hook-form";

// Schema
import { RegisterSchema } from "@/schemas/index";

// Actions
import { signup } from "@/actions/auth";

// Zod
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LogInWithGoogle from "../login/log-in-with-google";

const SignupForm = () => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string>();

  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof RegisterSchema>) {
    startTransition(() => {
      signup(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (data?.success) {
          router.push("/auth/login");
        }
      });
    });
  }
  return (
    <div className="w-11/12 max-w-xs border rounded-md p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            disabled={isPending}
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Alex Williams" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@mail.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={isPending}
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button asChild variant={"link"} className="flex justify-center">
            <Link href="/auth/login" className="underline">
              Already have an account? Sign in
            </Link>
          </Button>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "Loading..." : " Sign up"}
          </Button>
        </form>
      </Form>
      <div className="flex items-center gap-5">
        <hr className="flex-1 h-px bg-slate-900" />
        <p className="my-4 text-slate-400 text-sm">or</p>
        <hr className="flex-1 h-px bg-slate-900" />
      </div>
      <LogInWithGoogle />
    </div>
  );
};

export default SignupForm;
