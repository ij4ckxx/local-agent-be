import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { prisma } from '../db/prisma';
export async function hashPassword(password: string){
    return bcrypt.hash(password,10);
}

export async function verifyPassword(password:string, hash:string){
    return bcrypt.compare(password, hash);
}

export function generateToken(userId:string){
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET!,
        {
            expiresIn: "7d"
        }
    )
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const now = new Date();

  const user = await prisma.users.create({
    data: {
      id: randomUUID(),
      name,
      email,
      password_hash: passwordHash,
      created_at: now,
      updated_at: now,
    },
  });

  const token = generateToken(user.id);

  return {
    user,
    token,
  };
}

export async function loginUser(
  email: string,
  password: string
) {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user || !user.password_hash) {
    throw new Error("Invalid email or password");
  }

  const isValidPassword = await verifyPassword(
    password,
    user.password_hash
  );

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id);

  return {
    user,
    token,
  };
}