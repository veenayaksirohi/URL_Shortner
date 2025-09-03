// src/validators/auth.validator.js
import { z } from "zod";
// Password must be 8+ chars, include uppercase, lowercase, digit, special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Phone: exactly 10 digits
const phoneRegex = /^\d{10}$/;
// Email: basic valid email structure
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, { message: "Name must be at least 2 characters long" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email format" })
    .regex(emailRegex, { message: "Email must be a valid email address" }),
  phone: z
    .string()
    .regex(phoneRegex, { message: "Phone number must be exactly 10 digits" }),
  password: z
    .string({ required_error: "Password is required" })
    .regex(passwordRegex, {
      message:
        "Password must be 8+ chars, include uppercase, lowercase, number & special char",
    }),
});

export const loginSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Invalid email format" })
      .regex(emailRegex, { message: "Email must be a valid email address" })
      .optional(),
    phone: z
      .string()
      .regex(phoneRegex, { message: "Phone must be exactly 10 digits" })
      .optional(),
    password: z.string({ required_error: "Password is required" }),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email"],
  });

export const urlSchema = z.object({
  url: z
    .string({ required_error: "URL is required" })
    .url({ message: "Invalid URL" })
    .nonempty({ message: "URL is required" }),
});
