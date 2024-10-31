import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { employee } from "./employee";
import { relations } from "drizzle-orm";
import { admin } from "./admin";
type IRole = 'employee'|'admin';
export type IGender ='male'| 'female'
export const user = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    gender: text('gender').notNull().$type<IGender>(),
    birth_date: integer('birth_date',{mode:"timestamp"}).notNull(),
    role: text('role').notNull().default('employee').$type<IRole>(),
});

export const userRelations = relations(user, ({ one }) => ({
    employee: one(employee),
    admin: one(admin),
}));


