import { Request, Response, NextFunction } from 'express';
import * as reviewService from '../services/review.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await reviewService.createReview({
      userId: req.user!.id,
      eventId: Number(req.params.eventId),
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });
    sendCreated(res, review, 'Ulasan berhasil dikirim');
  } catch (e) { next(e); }
};

export const getEventReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await reviewService.getEventReviews(Number(req.params.eventId));
    sendSuccess(res, result);
  } catch (e) { next(e); }
};
