import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { organization } from "./organization";
import { relations } from "drizzle-orm";
import { employee } from "./employee";

export const office = sqliteTable('office', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    organization_id: integer('organization_id').references(() => organization.id).notNull(),
    name: text('name').notNull(),
  });

  
export const officeRelations = relations(office, ({ one, many }) => ({
    organization: one(organization, {
      fields: [office.organization_id],
      references: [organization.id],
      relationName: 'organizationOffice',
    }),
    employees: many(employee),
  }));
  
  