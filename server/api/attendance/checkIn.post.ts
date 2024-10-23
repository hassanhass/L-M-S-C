export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const employeeId = body.employee_id;

    if (!employeeId) {
        throw createError({ statusCode: 400, message: 'Employee ID is required' });
    }

    const checkIn = await useDrizzle().insert(tables.attendance).values({
        employee_id: employeeId,
        check_in_time: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
    });
    return checkIn;
});
