 import {hash} from 'bcrypt';
export default defineEventHandler(async (event) => {
    
    if(process.env.APP_ENV === 'production'){
        throw createError({status: 403, message: 'Forbidden'});
    }
    const startTime= new Date()  ;

    await useDrizzle().delete(tables.employee);
    await useDrizzle().delete(tables.admin);
    await useDrizzle().delete(tables.user);
    await useDrizzle().delete(tables.office);
    await useDrizzle().delete(tables.organization);



    const addOrg = await useDrizzle().insert(tables.organization).values({
        name:'flsten'
    }).returning();

    const addOffice = await useDrizzle().insert(tables.office).values({
        name:'h1',
        organization_id:addOrg[0].id
    }).returning();

    
    const userAdmin = await useDrizzle().insert(tables.user).values([
        {
        email: 'admin1@a.com',
        name: 'admin1',
        gender: 'male',
        birth_date: new Date(),
        password: await hash('123456', 10),
        role: 'admin'
        },

    ]).returning();
    const admin = await useDrizzle().insert(tables.admin).values({
        user_id:userAdmin[0].id
    }).returning();

    const userEmployee = await useDrizzle().insert(tables.user).values({
        role:'employee',
        email:'employee@a.com',
        birth_date: new Date(),
        gender:'male',
        password: await hash('123456', 10),
        name:'employee1'

    }).returning();

    const employee = await useDrizzle().insert(tables.employee).values({
        user_id:userEmployee[0].id,
        office_id:addOffice[0].id,
        admin_id:admin[0].id,
        position:'employee',

    }).returning();

    const endTime = new Date()
    const totalTime = endTime.getTime()- startTime.getTime()
    return { success: 'Admin made sucssfiy' , totalTime};
});