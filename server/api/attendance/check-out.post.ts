import { attendance } from "~/server/database/schema";
import { useMe } from "~/server/utils/me";

export default defineEventHandler(async (event) => {
  const employee = await useMe(event);

  const updateCheckOut = await useDrizzle().update(tables.attendance)
    .set({
      check_out_time: new Date().toISOString(),
    })
    .where(eq(tables.attendance.employee_id, employee.id))
  return updateCheckOut;
});
