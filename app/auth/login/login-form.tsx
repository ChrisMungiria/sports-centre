"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

// Form Items
import { useForm } from "react-hook-form";

// Schema
import { LoginSchema } from "@/schemas/index";

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
import { login } from "./actions";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string>();

  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof LoginSchema>) {
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        }
        // } else if (data?.success) {
        //   router.push("/auth/login");
        // }
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
          <Button asChild variant={"link"} className="flex justify-center">
            <Link href="/auth/signup" className="underline">
              Don&apos;t have an account? Sign up instead
            </Link>
          </Button>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "Loading..." : " Log in"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
