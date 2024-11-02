import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event);

  const user = await useDrizzle().query.user.findFirst({
    where:eq(tables.user.email, email)
  })

  if(!user){
    throw createError({statusCode:401, message: 'unAuth'})
  }
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw createError({ statusCode: 400, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'sese',
    { expiresIn: '360d' }
  );

  return {
    token,
    message: 'Login successful',
    user
  };
});
