"use client";

import { useState, useTransition } from "react";

// Schemas
import { CategorySchema } from "@/schemas";

// Actions
import { addCategory, updateCategory } from "@/actions/category";

// Zod and React Hook Form
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

// ShadCN Toast
import { useToast } from "@/hooks/use-toast";

type CategoryFormProps = {
  category?: Category;
};

const CategoryForm = ({ category }: CategoryFormProps) => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string>("");

  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      title: category ? category.title : "",
      icon: category ? (category.icon as string) : "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof CategorySchema>) {
    startTransition(() => {
      addCategory(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (data.success) {
          toast({
            title: "Category added successfully",
            description: `Category '${values.title}' has been added successfully`,
          });
          form.reset();
        }
      });
    });
  }

  // Edit Submit handler
  function onEditSubmit(values: z.infer<typeof CategorySchema>) {
    startTransition(() => {
      updateCategory(values, category!.id).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else if (data.success) {
          toast({
            title: "Category updated successfully",
            description: `Category '${values.title}' has been updated successfully`,
          });
          form.reset();
        }
      });
    });
  }

  return (
    <div className="w-11/12 max-w-xs border rounded-md p-2 mx-auto space-y-4">
      <Form {...form}>
        <form
          onSubmit={
            category
              ? form.handleSubmit(onEditSubmit)
              : form.handleSubmit(onSubmit)
          }
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Basketball"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category icon (optional)</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Pick an icon from your emojis"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          {category ? (
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? "Editing..." : "Edit category"}
            </Button>
          ) : (
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? "Adding..." : "Add category"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
