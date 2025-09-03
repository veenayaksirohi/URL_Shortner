import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './user.model.js';

export const urls = pgTable(
  'urls',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    shortcode: varchar('shortcode', { length: 64 }).notNull(),
    targeturl: text('targeturl').notNull(),
    userid: uuid('userid')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    shortcode_unique: uniqueIndex('urls_shortcode_unique').on(table.shortcode),
    user_id_index: index('urls_user_id_index').on(table.userid),
    created_at_index: index('urls_created_at_index').on(table.created_at),
  })
);
