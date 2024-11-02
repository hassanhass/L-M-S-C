import { getTableColumns } from "drizzle-orm";
import { attendance, employee } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
    const user = await useMe(event, 'admin')

    
    const {password,...userTable} = getTableColumns(tables.user)
    const result = await useDrizzle().select({
        user:userTable,
        employee: tables.employee,
        attendance: tables.attendance
    }).from(tables.attendance).
        innerJoin(tables.employee, and(
            eq(tables.attendance.employee_id, tables.employee.id),
            eq(tables.employee.admin_id, user.admin?.id!),
        )).leftJoin(tables.user, eq(tables.employee.user_id, tables.user.id))
    
        console.log(result);
     return result;

});


