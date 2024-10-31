import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { office } from "../schema";

export const organization = sqliteTable('organizations', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
});

export const organizationRelations = relations(organization, ({ many }) => ({
    office: many(office),
}));