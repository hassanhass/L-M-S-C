import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const employees = sqliteTable('employees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  //gender, berithdate??///
  //position
  //start_date
  employee_number: text('employee_number').notNull().unique(),
  role: text('role').notNull().default('employee'),
});

//we need users table right here??

export const attendance = sqliteTable('attendance', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  employee_id: integer('employee_id').notNull().references(() => employees.id), 
  check_in_time: text('check_in_time').notNull(),
  check_out_time: text('check_out_time'),
  //work_time
  //note
  date: text('date').notNull(), 
});

export const employeesRelations = relations(employees, ({ many }) => ({
  attendanceRecords: many(attendance), 
}));


export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employee_id],
    references: [employees.id], 
  }),
}));
