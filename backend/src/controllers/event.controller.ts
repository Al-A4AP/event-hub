import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, category, location, page, limit } = req.query;
    const result = await eventService.getPublishedEvents({
      search: search as string,
      category: category as string,
      location: location as string,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    sendSuccess(res, result);
  } catch (e) { next(e); }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.getEventDetail(Number(req.params.id));
    sendSuccess(res, event);
  } catch (e) { next(e); }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.createEvent(req.user!.id, req.body);
    sendCreated(res, event, 'Event berhasil dibuat');
  } catch (e) { next(e); }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.updateEvent(Number(req.params.id), req.user!.id, req.body);
    sendSuccess(res, event, 'Event berhasil diperbarui');
  } catch (e) { next(e); }
};

export const publishEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.publishEvent(Number(req.params.id), req.user!.id);
    sendSuccess(res, event, 'Event berhasil dipublikasikan');
  } catch (e) { next(e); }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await eventService.deleteEvent(Number(req.params.id), req.user!.id);
    sendSuccess(res, null, 'Event berhasil dihapus');
  } catch (e) { next(e); }
};

export const getOrganizerEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await eventService.getOrganizerEvents(req.user!.id);
    sendSuccess(res, events);
  } catch (e) { next(e); }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await eventService.getCategories();
    sendSuccess(res, categories);
  } catch (e) { next(e); }
};
