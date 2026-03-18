import { prisma } from '../config/database';
import { TransactionStatus } from '@prisma/client';

export const createTransaction = (data: {
  userId: number;
  eventId: number;
  ticketTypeId?: number;
  quantity: number;
  totalPrice: number;
  pointsUsed: number;
  voucherCode?: string;
  discountAmount: number;
  finalPrice: number;
  expiredAt?: Date;
}) =>
  prisma.transaction.create({
    data,
    include: {
      event: { select: { id: true, title: true, startDate: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

export const findTransactionsByUser = (userId: number) =>
  prisma.transaction.findMany({
    where: { userId },
    include: { event: { select: { id: true, title: true, startDate: true, location: true, imageUrl: true } } },
    orderBy: { createdAt: 'desc' },
  });

export const findTransactionById = (id: number) =>
  prisma.transaction.findUnique({
    where: { id },
    include: {
      event: true,
      user: { select: { id: true, name: true, email: true } },
    },
  });

export const findTransactionsByEvent = (eventId: number) =>
  prisma.transaction.findMany({
    where: { eventId, status: 'PAID' },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });

export const updateTransactionStatus = (id: number, status: TransactionStatus, paymentProof?: string) =>
  prisma.transaction.update({
    where: { id },
    data: { status, ...(paymentProof && { paymentProof }) },
  });

export const getTransactionStats = async (organizerId: number, period: 'daily' | 'monthly' | 'yearly') => {
  const now = new Date();
  let startDate: Date;

  if (period === 'daily') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  } else if (period === 'monthly') {
    startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  } else {
    startDate = new Date(now.getFullYear() - 4, 0, 1);
  }

  return prisma.transaction.findMany({
    where: {
      event: { organizerId },
      status: 'PAID',
      createdAt: { gte: startDate },
    },
    select: { finalPrice: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });
};
