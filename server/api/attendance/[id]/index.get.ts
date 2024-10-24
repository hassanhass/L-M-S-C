import { useMe } from "~/server/utils/me";

export default defineEventHandler(async (event) => {
    const employee = await useMe(event);

    if (!employee) {
        throw createError({ statusCode: 400, message: 'Employee is not logged in' });
    }

    try {
        const findAttendance = await useDrizzle().query.attendance.findMany({
            where:eq(tables.attendance.employee_id, employee.id),
        });

        if (!findAttendance) {
            throw createError({ statusCode: 404, message: 'Attendance not found for this employee' });
        }

        return findAttendance; 
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Failed to retrieve attendance record. Please try again later.',
        });
    }

});
