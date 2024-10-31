// server/api/employees/[userId].get.ts
import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
    const { id } = getRouterParams(event)

    if(!id){
        throw createError({ 
            status: 400,
            message: 'Employee ID is required'
        })
    }

  const employee = await useDrizzle().query.employee.findFirst({
    where: eq(tables.employee.id, Number(id)),
    with: { 
      attendanceRecords: true,
      office: true,
      user: {
        columns: { password: false , role: false }
      }
    }
  })

  if (!employee) {
    throw createError({ 
      status: 404,
      message: 'Employee not found'
    })
  }


  return {
    employee
  };
});







