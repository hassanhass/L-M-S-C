// server/api/employees/[id].delete.ts
import { defineEventHandler, createError, getRouterParams } from 'h3';
import { eq } from 'drizzle-orm';
import { employee, user } from '~/server/database/schema';

export default defineEventHandler(async (event) => {
    const { id } = getRouterParams(event);
    const admin = await useMe(event, 'admin');

    if (admin.role !== 'admin') {
        throw createError({ status: 403, message: 'Forbidden' });
    }

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Employee ID is required'
        });
    }

    const existingUser = await useDrizzle().query.user.findFirst({
        where: eq(user.id, Number(id)),
    });

    console.log(existingUser);

    if (!existingUser) {
        throw createError({
            status: 404,
            message: 'Employee not found'
        });
    }
    const deleteUser = await useDrizzle().delete(tables.user)
    .where(eq(user.id, existingUser.id));


    return {
        message: 'Employee deleted successfully'
    };
});
