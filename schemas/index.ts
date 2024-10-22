import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string(),
});

export const RegisterSchema = z.object({
  fullname: z.string().min(3, {
    message: "Name must be at least 3 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export const CategorySchema = z.object({
  icon: z.string(),
  title: z.string().min(2, {
    message: "Title must have at least 2 characters",
  }),
});

export const PostSchema = z.object({
  title: z.string().min(2, {
    message: "Title must contain at least 2 characters",
  }),
  description: z.string().min(2, {
    message: "Description must have at least 2 characters",
  }),
  category: z.number().min(1, {
    message: "Please select a category",
  }),
});
