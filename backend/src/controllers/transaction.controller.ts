import { Request, Response, NextFunction } from 'express';
import * as txService from '../services/transaction.service';
import { sendSuccess, sendCreated } from '../utils/response';

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.createTransaction({
      userId: req.user!.id,
      eventId: Number(req.body.eventId),
      ticketTypeId: req.body.ticketTypeId ? Number(req.body.ticketTypeId) : undefined,
      quantity: Number(req.body.quantity) || 1,
      voucherCode: req.body.voucherCode,
      pointsUsed: Number(req.body.pointsUsed) || 0,
    });
    sendCreated(res, tx, 'Transaksi berhasil dibuat');
  } catch (e) { next(e); }
};

export const getMyTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const txs = await txService.getMyTransactions(req.user!.id);
    sendSuccess(res, txs);
  } catch (e) { next(e); }
};

export const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.getTransactionById(Number(req.params.id), req.user!.id);
    sendSuccess(res, tx);
  } catch (e) { next(e); }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.confirmPayment(Number(req.params.id), req.user!.id, req.body.paymentProof);
    sendSuccess(res, tx, 'Pembayaran berhasil dikonfirmasi');
  } catch (e) { next(e); }
};

export const cancelTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tx = await txService.cancelTransaction(Number(req.params.id), req.user!.id);
    sendSuccess(res, tx, 'Transaksi berhasil dibatalkan');
  } catch (e) { next(e); }
};
