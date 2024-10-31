import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { attendance, office, user } from "../schema";
import { admin } from "./admin";

export const employee = sqliteTable('employees', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: integer('user_id').references(() => user.id,
    {
        onDelete: 'set null',
    }
    ),
    admin_id: integer('admin_id').references(() => admin.id),
    office_id: integer('office_id').references(() => office.id),
    position: text('position').notNull(),
});


export const employeesRelations = relations(employee, ({ many, one }) => ({
    attendanceRecords: many(attendance),
    office: one(office, {
        fields: [employee.office_id],
        references: [office.id],
        relationName: 'officeEmployees',
    }),
    user: one(user, {
        fields: [employee.user_id],
        references: [user.id],
        relationName: 'employee',
    }),
    admin: one(admin, {
        fields: [employee.admin_id],
        references: [admin.id],
        relationName: 'adminEmployees',
    }),

}));



