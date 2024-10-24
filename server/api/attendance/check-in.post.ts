import { useMe } from "~/server/utils/me";

export default defineEventHandler(async (event) => {
    const employee = await useMe(event);

    if (!employee) {
        throw createError({ statusCode: 400, message: 'Employee is not logged in' });
    }

    const today = new Date().toISOString().split('T')[0];


    const existingCheckIn = await useDrizzle()
        .select({
            id: tables.attendance.id,
            employee_id: tables.attendance.employee_id,
            date: tables.attendance.date,
        })
        .from(tables.attendance)
        .where(
            and(
                eq(tables.attendance.employee_id, employee.id),
                eq(tables.attendance.date, today),
            )
        ).limit(1);

    if (existingCheckIn.length > 0) {

        throw createError({
            statusCode: 400,
            message: 'You have already checked in today.'
        });
    }


    try {
        const checkIn = await useDrizzle().insert(tables.attendance).values({
            employee_id: employee.id,
            check_in_time: new Date().toISOString(),
            date: today,
        }).returning();

        return checkIn[0];
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Failed to record check-in. Please try again later.'
        });
    }
});
