import { nanoid } from 'nanoid';
import { db } from '../configs/db.js';
import { urlSchema } from '../validators/req.validator.js';
import { or, eq } from "drizzle-orm";
import { urls } from '../model/index.js';
import { ZodError } from "zod";
import logger from '../utils/logger.js';

// Shorten URL
export const shorten = async (req, res) => {
  try {
    const validatedData = await urlSchema.parseAsync(req.body);
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { url: targeturl } = validatedData;

    // Robust uniqueness: retry insert upon DB collision
    let shortcode, result;
    const maxRetries = 5;
    let retries = 0;
    while (retries < maxRetries) {
      shortcode = nanoid(6);
      try {
        result = await db.insert(urls).values({
          userid: userId,
          shortcode,
          targeturl,
        }).returning();
        break; // Insert succeeded
      } catch (err) {
        // Check for DB unique constraint error (example assumes Postgres: err.code === '23505')
        if (err.code === '23505' || err.constraint?.includes('shortcode')) {
          retries++;
          continue; // Try again
        }
        throw err;
      }
    }
    if (!result || !result) {
      return res.status(500).json({ message: "Could not generate unique shortcode" });
    }
    res.status(201).json({
      message: "Short URL created successfully",
      shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${shortcode}`,
      url: result,
    });
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
    logger.error({ err: error }, 'Shorten error');
    return res.status(500).json({ message: "Internal server error" });
  }
};

// List all URLs for a user
export const allUrls = async (req, res) => {
  try {
    const userid = req.user?.id;
    if (!userid) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const userUrls = await db
      .select({
        shortcode: urls.shortcode,
        targeturl: urls.targeturl,
        id: urls.id,
        created_at: urls.created_at,
      })
      .from(urls)
      .where(eq(urls.userid, userid));

    res.status(200).json({ urls: userUrls });
  } catch (error) {
    logger.error({ err: error }, 'allUrls error');
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete URL by id
export const delUrls = async (req, res) => {
  try {
    const userid = req.user?.id;
    if (!userid) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Missing URL id" });
    }
    const urlToDelete = await db
      .select()
      .from(urls)
      .where(eq(urls.id, id));

    if (!urlToDelete.length || urlToDelete[0].userid !== userid) {
      return res.status(404).json({ message: "URL not found or not authorized" });
    }

    await db.delete(urls).where(eq(urls.id, id));

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    logger.error({ err: error }, 'delUrls error');
    res.status(500).json({ message: "Internal server error" });
  }
};

// Redirect short URL
export const redirect = async (req, res) => {
  try {
    const { shortcode } = req.params;
    if (!shortcode) {
      return res.status(400).json({ message: "Missing shortcode parameter" });
    }

    const result = await db
      .select({ targeturl: urls.targeturl })
      .from(urls)
      .where(eq(urls.shortcode, shortcode));

    if (!result.length) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    return res.redirect(result[0].targeturl);
  } catch (error) {
    logger.error({ err: error }, 'redirect error');
    res.status(500).json({ message: "Internal server error" });
  }
};
