"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

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
import { useToast } from "@/hooks/use-toast";

const SignupForm = () => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string>();

  const { toast } = useToast();

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
          toast({
            title: "Confirm your email",
            description: `We have sent a confirmation email to ${values.email}. Please check your inbox and click the confirmation link to complete the registration process.`,
          });
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
    </div>
  );
};

export default SignupForm;
