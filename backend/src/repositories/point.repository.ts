import { prisma } from '../config/database';

export const createPoint = (data: {
  userId: number;
  points: number;
  source: string;
  expiresAt: Date;
}) => prisma.userPoint.create({ data });

export const getActivePointsByUser = async (userId: number) => {
  const now = new Date();
  const points = await prisma.userPoint.findMany({
    where: { userId, isUsed: false, expiresAt: { gt: now } },
  });
  return points.reduce((sum, p) => sum + p.points, 0);
};

export const getUserPointHistory = (userId: number) =>
  prisma.userPoint.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

export const markPointsAsUsed = (pointIds: number[]) =>
  prisma.userPoint.updateMany({
    where: { id: { in: pointIds } },
    data: { isUsed: true },
  });

// Get unused, non-expired point records up to the amount needed
export const getUsablePoints = async (userId: number, needed: number) => {
  const now = new Date();
  const records = await prisma.userPoint.findMany({
    where: { userId, isUsed: false, expiresAt: { gt: now } },
    orderBy: { expiresAt: 'asc' },
  });
  let remaining = needed;
  const toUse: number[] = [];
  for (const r of records) {
    if (remaining <= 0) break;
    toUse.push(r.id);
    remaining -= r.points;
  }
  return toUse;
};
