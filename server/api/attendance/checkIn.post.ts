import { useMe } from "~/server/utils/me";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const employee = await useMe(event);    
    if (!employee) {
        throw createError({ statusCode: 400, message: 'Employee ID is required' });
    }

    const checkIn = await useDrizzle().insert(tables.attendance).values({
        employee_id: employee.id,
        check_in_time: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
    }).returning();
    return checkIn[0];
});
