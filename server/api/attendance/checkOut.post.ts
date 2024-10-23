import { attendance } from "~/server/database/schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const employeeId = body.employee_id;

  const updateCheckOut = await useDrizzle().update(tables.attendance)
    .set({
      check_out_time: new Date().toISOString(),
    })
    .where(eq(tables.attendance.employee_id, employeeId))
  return updateCheckOut;
});
