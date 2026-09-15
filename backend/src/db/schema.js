import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const leaderboard = pgTable('leaderboard', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  time: varchar('time', { length: 20 }).notNull(),
  timeSeconds: integer('time_seconds').notNull(),
  difficulty: varchar('difficulty', { length: 20 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});
