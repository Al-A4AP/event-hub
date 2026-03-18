import { prisma } from '../config/database';
import { Role } from '@prisma/client';

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email } });

export const findUserById = (id: number) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, referralCode: true, avatar: true, createdAt: true },
  });

export const findUserByReferralCode = (code: string) =>
  prisma.user.findUnique({ where: { referralCode: code } });

export const createUser = (data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  referralCode: string;
  referredBy?: string;
}) => prisma.user.create({ data });
