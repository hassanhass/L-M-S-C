import { and, gte, lte, eq } from 'drizzle-orm';
import { attendance } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
    const { employee_id } = await readBody(event);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1).toISOString();   
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString();   

    const attendanceRecords = await useDrizzle()
        .select()
        .from(attendance)
        .where(
            and(
                eq(attendance.employee_id, employee_id),
                gte(attendance.check_in_time, startOfMonth),
                lte(attendance.check_in_time, endOfMonth)
            )
        )
        .all(); 

    let totalHours = 0;

    for (const record of attendanceRecords) {
        const checkInTime = new Date(record.check_in_time);
        const checkOutTime = record.check_out_time ? new Date(record.check_out_time) : new Date();  

        const hoursWorked = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);       
        totalHours += hoursWorked;
    }

    return { totalHours };
});
