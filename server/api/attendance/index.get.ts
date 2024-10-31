export default defineEventHandler(async (event) => {

    const attendanceRecords = await useDrizzle().query.attendance.findMany({
        columns: { check_in_time: true, check_out_time: true },
        with: {
            employee: {
                columns: {
                    id: true,
                    position: true,
                },
                with:{
                    user: {
                        columns: {
                            email: true,
                            name: true,
                        }
                    }
                }
            },
        }
    })
    return attendanceRecords;
});