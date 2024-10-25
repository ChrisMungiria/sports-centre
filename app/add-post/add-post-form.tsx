"use client";

import { useState, useTransition } from "react";

// Schemas
import { PostSchema } from "@/schemas";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Actions
import { addPostAction } from "@/actions/post";

type AddPostFormProps = {
  data: Category[] | null | undefined;
};

const AddPostForm = ({ data }: AddPostFormProps) => {
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string>("");

  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostSchema>>({
    resolver: zodResolver(PostSchema),
    defaultValues: {
      category: 0,
      description: "",
      title: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof PostSchema>) {
    const formData = new FormData();
    if (values.image) {
      formData.append("image", values.image); // Append the image to FormData
    }

    formData.append("category", values.category.toString());
    formData.append("description", values.description);
    formData.append("title", values.title);
    startTransition(() => {
      addPostAction(formData).then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.success) {
          toast({
            title: "Post added successfully",
            description: `Post '${values.title}' added successfully`,
          });
          form.reset();
        }
      });
    });
  }
  return (
    <div className="w-11/12 max-w-xs border rounded-md p-2 mx-auto space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Write a short title about the post"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Here you can write details about the post"
                    disabled={isPending}
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport Category</FormLabel>
                <Select
                  disabled={isPending}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a sport category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data?.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.icon} {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    disabled={isPending}
                    onChange={(e) => {
                      if (e.target.files) {
                        // Handle file upload logic here
                        field.onChange(e.target.files[0]);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Posting..." : "Add Post"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddPostForm;
