import { H3Event } from 'h3';
import jwt from 'jsonwebtoken';

export async function useMe(event: H3Event,relation?:'admin'|'employee') {
    const { token } = getHeaders(event);
    if (!token) {
        throw createError({ statusCode: 401, message: 'Unauthorized' });
    }
    try{
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET||'sese') as { id: number };
        const user = await useDrizzle().query.user.findFirst(
            {
                where: eq(tables.user.id, tokenDecode.id),
                columns: {
                    password: false
                },
                with:{
                    admin: relation === 'admin'?true:undefined,
                    employee: relation === 'employee'?true:undefined
                }
            }
        );
        if (!user) {
            throw createError({ statusCode: 401, message: 'Unauthorized' });
        }
        return user;
    }catch(e){
        throw createError({ statusCode: 401, message: 'Unauthorized' });
    }

    
}