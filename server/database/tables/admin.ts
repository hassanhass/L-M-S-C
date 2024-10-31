
import { relations } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { user } from "./user";
import { employee } from "./employee";


export const admin = sqliteTable('admin', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: integer('user_id').references(() => user.id,
    {
        onDelete: 'cascade',
    }).notNull(),

});

export const adminRelations = relations(admin, ({ one,many }) => ({
    user: one(user, {
        fields: [admin.user_id],
        references: [user.id],
        relationName: 'adminUser',
    }),
    employees: many(employee),
}));