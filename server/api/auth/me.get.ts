import jwt from 'jsonwebtoken';
import { useMe } from '~/server/utils/me';

export default defineEventHandler(async (event) => {
    
    const employee = await useMe(event);
    return employee;
    
});