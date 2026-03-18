import { prisma } from '../config/database';

export const findVoucherByCode = (code: string) =>
  prisma.voucher.findUnique({ where: { code }, include: { event: true } });

export const createUserVoucher = (userId: number, voucherId: number) =>
  prisma.userVoucher.create({ data: { userId, voucherId } });

export const findUserVoucher = (userId: number, voucherId: number) =>
  prisma.userVoucher.findUnique({ where: { userId_voucherId: { userId, voucherId } } });

export const markUserVoucherUsed = (id: number) =>
  prisma.userVoucher.update({ where: { id }, data: { isUsed: true, usedAt: new Date() } });

export const incrementVoucherUsage = (id: number) =>
  prisma.voucher.update({ where: { id }, data: { usedCount: { increment: 1 } } });

export const getUserVouchers = (userId: number) =>
  prisma.userVoucher.findMany({
    where: { userId },
    include: { voucher: { include: { event: { select: { title: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

export const createVoucher = (data: {
  eventId: number;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  maxUsage: number;
  startDate?: Date;
  expiresAt: Date;
}) => prisma.voucher.create({ data });

export const getEventVouchers = (eventId: number) =>
  prisma.voucher.findMany({ where: { eventId }, orderBy: { createdAt: 'desc' } });
