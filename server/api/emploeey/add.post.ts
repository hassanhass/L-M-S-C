// server/api/employees/addEmployee.post.ts
import { defineEventHandler, readBody, use } from 'h3';
import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { z } from 'zod'
import { IGender } from '~/server/database/tables/user';

const bodyZod = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
    position: z.string(),
    office_id: z.number(),
    gender: z.enum(['male', 'female']),
})
export default defineEventHandler(async (event) => {

    const body: z.infer<typeof bodyZod> = await readBody(event);
    try {
        bodyZod.parse(body);
    }

    catch (err) {
        throw createError({ status: 400, data: err, stack: '' });
    }

    const admin = (await useMe(event, 'admin'));

    if (admin.role !== 'admin') {
        throw createError({ status: 403, message: 'Forbidden' });
    }
    const existingUser = await useDrizzle().query.user.findFirst({
        where: eq(tables.user.email, body.email),
    });

    if (existingUser) {
        throw createError({ status: 409, message: 'Email already in use' });
    }

    const checkOffice = await useDrizzle().query.office.findFirst({
        where: eq(tables.office.id, body.office_id),
    });

    if (!checkOffice) {
        throw createError({ status: 404, message: 'Office not found' });
    }

    const hashedPassword = await hash(body.password, 10);

    const user = await useDrizzle().insert(tables.user).values({
        email: body.email,
        name: body.name,
        birth_date: new Date(),
        gender: body.gender,
        password: hashedPassword,
        role: 'employee',
    }).returning();

    if (!user) {
        throw createError({ status: 500, message: 'Failed to insert user' });
    }

    const employee = await useDrizzle().insert(tables.employee).values({
        user_id: user[0].id,
        admin_id: admin.admin?.id!,
        office_id: checkOffice.id,
        position: body.position,
    }).returning();

    return { success: true, employee };


});
