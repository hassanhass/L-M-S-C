import { H3Event } from 'h3';
import jwt from 'jsonwebtoken';

export async function useMe(event: H3Event) {
    const { token } = getHeaders(event);
    if (!token) {
        throw createError({ statusCode: 401, message: 'Unauthorized' });
    }
    try{
        const tokenDecode = jwt.decode(token) as { id: number };
        const employee = await useDrizzle().query.employees.findFirst(
            {
                where: eq(tables.employees.id, tokenDecode.id),
                columns: {
                    password: false
                }
            }
        );
        if (!employee) {
            throw createError({ statusCode: 401, message: 'Unauthorized' });
        }
        return employee;
    }catch(e){
        throw createError({ statusCode: 401, message: 'Unauthorized' });
    }

    
}