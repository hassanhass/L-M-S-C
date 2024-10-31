// import { attendance } from "~/server/database/schema";
// import { useMe } from "~/server/utils/me";

// export default defineEventHandler(async (event) => {
//   const employee = await useMe(event);

//   const updateCheckOut = await useDrizzle().update(tables.attendance)
//     .set({
//       check_out_time: new Date().toISOString(),
//     })
//     .where(eq(tables.attendance.employee_id, employee.id))
//   return updateCheckOut;
// });




// server/api/attendance/checkOut.post.js

// import { eq } from 'drizzle-orm';
// import { Attendance } from '~/server/database/schema';

// export default defineEventHandler(async (event) => {
//   const { employee_id } = await readBody(event);
//   const currentDate = new Date().toISOString().split('T')[0];
//   const lastCheckIn = await useDrizzle()
//     .select()
//     .from(Attendance)
//     .where(
//       and(
//         eq(Attendance.employee_id, employee_id),
//         eq(Attendance.date, currentDate))).limit(1).get();

//   // التحقق من وجود سجل للحضور
//   if (!lastCheckIn) {
//     throw createError({ statusCode: 400, message: 'No check-in record found.' });
//   }


//   // تسجيل الخروج
//   const updatedRecord = await useDrizzle()
//     .update(Attendance)
//     .set({ check_out_time: new Date().toISOString() })
//     .where(eq(Attendance.id, lastCheckIn.id));
//   return updatedRecord ? { message: 'Check-out recorded successfully' } : { message: 'Failed to record check-out' };
// });
