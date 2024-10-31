// import { useMe } from "~/server/utils/me";


// export default defineEventHandler(async (event) => {
//     const employee = await useMe(event);

//     if (!employee) {
//         throw createError({ statusCode: 400, message: 'Employee is not logged in' });
//     }

//     const today = new Date().toISOString().split('T')[0];


//     const existingCheckIn = await useDrizzle()
//         .select({
//             id: tables.attendance.id,
//             employee_id: tables.attendance.employee_id,
//             date: tables.attendance.date,
//         })
//         .from(tables.attendance)
//         .where(
//             and(
//                 eq(tables.attendance.employee_id, employee.id),
//                 eq(tables.attendance.date, today),
//             )
//         ).limit(1);

//     if (existingCheckIn.length > 0) {

//         throw createError({
//             statusCode: 400,
//             message: 'You have already checked in today.'
//         });
//     }


//     try {
//         const checkIn = await useDrizzle().insert(tables.attendance).values({
//             employee_id: employee.id,
//             check_in_time: new Date().toISOString(),
//             date: today,
//         }).returning();

//         return checkIn[0];
//     } catch (error) {
//         throw createError({
//             statusCode: 500,
//             message: 'Failed to record check-in. Please try again later.'
//         });
//     }
// });
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
