// // utils/auth.ts
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = 'your_secret_key';

// export const hashPassword = async (password: string) => {
//   const saltRounds = 10;
//   return bcrypt.hash(password, saltRounds);
// };

// export const comparePasswords = async (password: string, hashedPassword: string) => {
//   return bcrypt.compare(password, hashedPassword);
// };

// export const generateJWT = (user: any) => {
//   return jwt.sign(
//     {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//     JWT_SECRET,
//     { expiresIn: '1h' }
//   );
// };

// export const verifyJWT = (token: string) => {
//   return jwt.verify(token, JWT_SECRET);
// };
