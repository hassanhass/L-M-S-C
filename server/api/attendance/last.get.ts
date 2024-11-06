import { desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const user = await useMe(event, 'employee');

    const attendance = await useDrizzle().query.attendance.findFirst({

        where:eq(tables.attendance.employee_id,user.employee?.id!),
        orderBy:desc(tables.attendance.id)
    })

    return attendance;
})