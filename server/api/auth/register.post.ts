import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcrypt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, email, password,employee_number} = body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  
  const employee = await useDrizzle().insert(tables.employees).values({
    name,
    email,
    employee_number,
    password:hashedPassword,
    role: 'employee',
  });

  return { message: 'Employee registered successfully', employee };
}
);
