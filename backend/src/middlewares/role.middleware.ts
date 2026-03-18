import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (allowedRoles: string[]) => {

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Tidak terautentikasi' });
      return;
    }
    // ADMIN bypasses all role restrictions
    if (req.user.role === 'ADMIN') { next(); return; }
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Akses ditolak. Hanya untuk: ${allowedRoles.join(', ')}`,
      });
      return;
    }
    next();
  };
};

