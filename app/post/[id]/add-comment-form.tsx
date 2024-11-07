"use client";

// React
import { useTransition } from "react";

// Form Items
import { useForm } from "react-hook-form";

// Schema
import { CommentSchema } from "@/schemas/index";

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

// Actions
import { addComment } from "./actions";

type AddCommentFormProps = {
  postId: string;
};

const AddCommentForm = ({ postId }: AddCommentFormProps) => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof CommentSchema>) {
    startTransition(() => {
      addComment(values, postId).then((data) => {
        if (data?.error) {
          toast({
            title: "Could not add comment",
            description: "Error adding comment, please try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Comment added",
            description: "Comment added successfully.",
          });
        }
        form.reset();
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
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Input placeholder="Say something here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isPending} type="submit" className="w-full">
            {isPending ? "Commenting..." : " Post Comment"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddCommentForm;
