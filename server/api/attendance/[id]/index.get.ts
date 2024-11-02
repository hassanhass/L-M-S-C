import { not } from "drizzle-orm";
import { useMe } from "~/server/utils/me";

export default defineEventHandler(async (event) => {
    const user = await useMe(event, 'employee');

    
    if (!user.employee?.user_id) {
        throw createError({
            statusCode: 404,
            message: 'Employee not found'
        });
    }
    const attendances = await useDrizzle().query.attendance.findMany({
        where: eq(tables.attendance.employee_id, user.employee.id)
    })

    return attendances;


});
