import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: (req.body.role as Role) || Role.CUSTOMER,
      referralCode: req.body.referralCode,
    });
    sendCreated(res, result, 'Registrasi berhasil');
  } catch (e) { next(e); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    sendSuccess(res, result, 'Login berhasil');
  } catch (e) { next(e); }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, user);
  } catch (e) { next(e); }
};
