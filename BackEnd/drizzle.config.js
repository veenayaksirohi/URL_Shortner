import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',          // migrations output folder
  schema: './src/model/index.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
});
