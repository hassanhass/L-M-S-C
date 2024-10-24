import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);
  const employee = await useDrizzle()
    .select()
    .from(tables.employees)
    .where(eq(tables.employees.email, email))
    .limit(1);

  if (!employee || employee.length === 0) {
    throw createError({ statusCode: 400, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  const passwordMatch = await bcrypt.compare(password, employee[0].password);

  if (!passwordMatch) {
    throw createError({ statusCode: 400, message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: employee[0].id, email: employee[0].email }, 'sdfsdfsdfsdf324k23l4klk;lk;l;sdfsd;4534535;lkl;sdlfsdl;fs;dlf', { expiresIn: '360d' });

  return {
      success: true,
      token,
      message: 'Login successful',
      employee: employee[0],
  };
});
