import { not } from "drizzle-orm";
import { useMe } from "~/server/utils/me";

export default defineEventHandler(async (event) => {
    const user = await useMe(event,'employee');
    if(!user.employee?.user_id ){
        throw createError({
            statusCode: 404,
            message: 'Employee not found'
        });
    }
    try {
        const findAttendance = await useDrizzle().query.attendance.findMany()
        
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
