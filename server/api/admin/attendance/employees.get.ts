import { useCurrentElement } from '@vueuse/core';
import { eq, isNull, not } from 'drizzle-orm';
import { employee, user } from '~/server/database/schema';

export default defineEventHandler(async (event) => {

    const user = await useMe(event, 'admin');
    if (user.role !== 'admin') {
        return { message: "Admin not found or not an admin role" };
    }

    
    const employeesUnderAdmin = await useDrizzle()
        .query.employee.findMany({
            where:
                and(
                    eq(employee.admin_id, user.admin?.id!),
                    not(isNull(employee.user_id))
                ),
            with: {
                attendanceRecords: {
                    columns: {
                        check_in_time: true,
                        check_out_time: true,
                    },

                },
                user: { columns: { password: false, role: false } }
            }
        });

    return { employees: employeesUnderAdmin };
});
//لازم نحط الاوركنايز