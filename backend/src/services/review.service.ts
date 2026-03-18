import { AppError } from '../middlewares/error.middleware';
import * as reviewRepo from '../repositories/review.repository';
import * as txRepo from '../repositories/transaction.repository';
import { prisma } from '../config/database';

export const createReview = async (data: {
  userId: number;
  eventId: number;
  rating: number;
  comment?: string;
}) => {
  // Validate: user must have a PAID transaction for this event
  const tx = await prisma.transaction.findFirst({
    where: { userId: data.userId, eventId: data.eventId, status: 'PAID' },
  });
  if (!tx) throw new AppError('Anda harus memiliki tiket berbayar untuk mengulas event ini', 403);

  // Validate: event must be completed
  const event = await prisma.event.findUnique({ where: { id: data.eventId } });
  if (!event) throw new AppError('Event tidak ditemukan', 404);
  if (new Date() < event.endDate) throw new AppError('Event belum selesai, ulasan belum bisa dikirim', 400);

  // Validate: no duplicate review
  const existing = await reviewRepo.findReviewByUserAndEvent(data.userId, data.eventId);
  if (existing) throw new AppError('Anda sudah mengulas event ini', 409);

  if (data.rating < 1 || data.rating > 5) throw new AppError('Rating harus antara 1 dan 5', 400);

  return reviewRepo.createReview(data);
};

export const getEventReviews = async (eventId: number) => {
  const reviews = await reviewRepo.findReviewsByEvent(eventId);
  const stats = await reviewRepo.getAverageRating(eventId);
  return { reviews, averageRating: Math.round((stats.average) * 10) / 10, totalReviews: stats.count };
};
