import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { employee } from "./employee";
import { relations } from "drizzle-orm";

export const attendance = sqliteTable('attendance', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    employee_id: integer('employee_id').notNull().references(() => employee.id),
    check_in_time: text('check_in_time').notNull(),
    check_out_time: text('check_out_time'),   
  });

  export const attendanceRelations = relations(attendance, ({ one }) => ({
    employee: one(employee, {
      fields: [attendance.employee_id],
      references: [employee.id],
    }),
  }));