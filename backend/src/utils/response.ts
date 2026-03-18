import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Berhasil',
  statusCode = 200
) => {
  res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (
  res: Response,
  message = 'Terjadi kesalahan',
  statusCode = 500,
  errors?: unknown
) => {
  res.status(statusCode).json({ success: false, message, errors });
};

export const sendCreated = (res: Response, data: unknown, message = 'Berhasil dibuat') => {
  sendSuccess(res, data, message, 201);
};
