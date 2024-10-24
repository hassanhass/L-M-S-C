export default defineEventHandler(async (event) => {
    
    const attendanceRecords= await useDrizzle().query.attendance.findMany({
        columns: { check_in_time: true, check_out_time: true, date: true },
        with: {
            employee: {
                columns: { id:true, name: true, email: true },
            }
        }
    })
return attendanceRecords;
});