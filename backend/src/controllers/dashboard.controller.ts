import { Request, Response, NextFunction } from 'express';
import * as dashService from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const period = (req.query.period as 'daily' | 'monthly' | 'yearly') || 'monthly';
    const result = await dashService.getDashboardStats(req.user!.id, period);
    sendSuccess(res, result);
  } catch (e) { next(e); }
};

export const getDashboardEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await dashService.getDashboardEvents(req.user!.id);
    sendSuccess(res, events);
  } catch (e) { next(e); }
};

export const getEventAttendees = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attendees = await dashService.getEventAttendees(Number(req.params.eventId), req.user!.id);
    sendSuccess(res, attendees);
  } catch (e) { next(e); }
};
