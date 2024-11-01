import { eq, desc } from 'drizzle-orm';
import { attendance } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
    const { employee_id } = await readBody(event);
    const currentTime = new Date().toISOString();

    const lastAttendanceRecord = await useDrizzle()
        .select()
        .from(attendance)
        .where(eq(attendance.employee_id, employee_id))
        .orderBy(desc(attendance.check_in_time))
        .limit(1)
        .get();

    if (lastAttendanceRecord) {
        if (lastAttendanceRecord.check_out_time) {
            const newAttendanceRecord = await useDrizzle()
                .insert(attendance)
                .values({
                    employee_id,
                    check_in_time: currentTime,
                    check_out_time: null,
                })
                .execute();

            return { message: "Check-in successful", newAttendanceRecord };
        } else {
            const updatedRecord = await useDrizzle()
                .update(attendance)
                .set({
                    check_out_time: currentTime,
                })
                .where(eq(attendance.id, lastAttendanceRecord.id))
                .execute();

            return { message: "Check-out successful", updatedRecord };
        }
    } else {
        const newAttendanceRecord = await useDrizzle()
            .insert(attendance)
            .values({
                employee_id,
                check_in_time: currentTime,
                check_out_time: null,
            })
            .execute();

        return { message: "Check-in successful", newAttendanceRecord };
    }
});
