// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import { db } from "../configs/db.js";
import { signupSchema, loginSchema } from "../validators/req.validator.js";
import { users } from "../model/index.js"; // import the users table directly
import { hashPassword, verifyPassword } from "../utils/hash.js";
import { or, eq } from "drizzle-orm";
import { ZodError } from "zod";
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export const register = async (req, res) => {
  try {
    const validatedData = await signupSchema.parseAsync(req.body);
    const { name, email, phone, password } = validatedData;

    const emailLower = email.toLowerCase();

    // Check for existing user by email OR phone
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.email, emailLower), eq(users.phone, phone)))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const { hash } = await hashPassword(password);

    // Insert new user
    const inserted = await db
      .insert(users)
      .values({
        name,
        email: emailLower,
        phone,
        password: hash,
      })
      .returning();

    const user = inserted[0];

    // Remove sensitive fields before returning
    const safeUser = { ...user };
    delete safeUser.password;

    return res
      .status(201)
      .json({ message: "User registered successfully", user: safeUser });
  } catch (error) {
    if (
      error instanceof ZodError ||
      error?.name === "ZodError" ||
      error?.issues
    ) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues || error.errors,
      });
    }
  logger.error({ err: error }, 'Register error');
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const validated = await loginSchema.parseAsync(req.body);
    let { email, phone, password } = validated;

    // Prefer email if provided; normalize for case-insensitive match
    let condition;
    if (email) {
      email = email.toLowerCase();
      condition = eq(users.email, email);
    } else {
      condition = eq(users.phone, phone);
    }

    const [user] = await db.select().from(users).where(condition).limit(1);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatches = await verifyPassword(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // create token
    const payload = { id: user.id, email: user.email ?? null };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.json({ message: "Login successful", token, user: safeUser });
  } catch (error) {
    if (
      error instanceof ZodError ||
      error?.name === "ZodError" ||
      error?.issues
    ) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.issues || error.errors,
      });
    }
  logger.error({ err: error }, 'Login error');
    return res.status(500).json({ message: "Internal server error" });
  }
};
