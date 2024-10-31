import { hash } from "bcrypt";
import { z } from "zod";

const bodyZod = z.object({
    email: z.string().email().nullable(),
    password: z.string().min(6).nullable(),
    name: z.string().nullable(),
    position: z.string().nullable(),
    office_id: z.number().nullable(),
    gender: z.enum(['male', 'female']).nullable(),
});

export default defineEventHandler(async (event) => {
    const body: z.infer<typeof bodyZod> = await readBody(event);

    try {
        bodyZod.parse(body);
    } catch (err) {
        throw createError({ status: 400, data: err, stack: '' });
    }

    const admin = await useMe(event, 'admin');
    if (admin.role !== 'admin') {
        throw createError({ status: 403, message: 'Forbidden' });
    }

    const { id } = getRouterParams(event);
    if (!id) {
        throw createError({ statusCode: 400, message: 'Employee ID is required' });
    }

    const existingUser = await useDrizzle().query.user.findFirst({
        where: eq(tables.user.id, Number(id)),
    });
    const existingEmployee = await useDrizzle().query.employee.findFirst({
        where: eq(tables.employee.user_id, Number(id)),
    });

    const hashedPassword = body?.password ? await hash(body.password, 10) : existingUser?.password;

    const updateUser = await useDrizzle().update(tables.user).set({
        email: body?.email ?? existingUser?.email,
        name: body?.name ?? existingUser?.name,
        gender: body?.gender ?? existingUser?.gender,
        password: hashedPassword,
    }).where(eq(tables.user.id, Number(id)));

    const updateEmployee = await useDrizzle().update(tables.employee).set({
        position: body?.position ?? existingEmployee?.position,
        office_id: body?.office_id ?? existingEmployee?.office_id,
    }).where(eq(tables.employee.user_id, Number(id)));

    return { message: 'Employee updated successfully' };
});
