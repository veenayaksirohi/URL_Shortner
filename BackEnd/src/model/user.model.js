import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    password: text('password').notNull(),
    created_at: timestamp('created_at').notNull().defaultNow(),
    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => ({
    email_unique: uniqueIndex('users_email_unique').on(table.email),
    phone_unique: uniqueIndex('users_phone_unique').on(table.phone),
    created_at_index: index('users_created_at_index').on(table.created_at),
  })
);
