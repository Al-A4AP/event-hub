import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

export const createReview = (data: {
  userId: number;
  eventId: number;
  rating: number;
  comment?: string;
}) => prisma.review.create({ data, include: { user: { select: { id: true, name: true, avatar: true } } } });

export const findReviewsByEvent = (eventId: number) =>
  prisma.review.findMany({
    where: { eventId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
    orderBy: { createdAt: 'desc' },
  });

export const findReviewByUserAndEvent = (userId: number, eventId: number) =>
  prisma.review.findUnique({ where: { userId_eventId: { userId, eventId } } });

export const getAverageRating = async (eventId: number) => {
  const result = await prisma.review.aggregate({
    where: { eventId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return { average: result._avg.rating ?? 0, count: result._count.rating };
};
