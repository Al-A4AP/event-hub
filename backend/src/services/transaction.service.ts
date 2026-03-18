import { AppError } from '../middlewares/error.middleware';
import * as txRepo from '../repositories/transaction.repository';
import * as voucherRepo from '../repositories/voucher.repository';
import * as pointRepo from '../repositories/point.repository';
import { prisma } from '../config/database';

export const createTransaction = async (data: {
  userId: number;
  eventId: number;
  ticketTypeId?: number;
  quantity: number;
  voucherCode?: string;
  pointsUsed: number;
}) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Get event
    const event = await tx.event.findUnique({ where: { id: data.eventId } });
    if (!event) throw new AppError('Event tidak ditemukan', 404);
    if (event.status !== 'PUBLISHED') throw new AppError('Event tidak tersedia', 400);
    if (event.availableSeats < data.quantity) throw new AppError('Kursi tidak mencukupi', 400);

    // 2. Base price calculation
    let unitPrice = Number(event.price);
    if (data.ticketTypeId) {
      const tt = await tx.ticketType.findUnique({ where: { id: data.ticketTypeId } });
      if (!tt || tt.eventId !== data.eventId) throw new AppError('Tipe tiket tidak valid', 400);
      if (tt.availableSeats < data.quantity) throw new AppError('Kuota tipe tiket tidak mencukupi', 400);
      unitPrice = Number(tt.price);
      await tx.ticketType.update({ where: { id: tt.id }, data: { availableSeats: { decrement: data.quantity } } });
    }

    const totalPrice = unitPrice * data.quantity;
    let discountAmount = 0;
    let voucherCode: string | undefined;

    // 3. Apply voucher
    if (data.voucherCode) {
      const voucher = await tx.voucher.findUnique({ where: { code: data.voucherCode } });
      if (!voucher) throw new AppError('Voucher tidak ditemukan', 404);
      if (voucher.expiresAt < new Date()) throw new AppError('Voucher sudah kadaluarsa', 400);
      if (voucher.usedCount >= voucher.maxUsage) throw new AppError('Voucher sudah habis digunakan', 400);

      const uv = await tx.userVoucher.findUnique({
        where: { userId_voucherId: { userId: data.userId, voucherId: voucher.id } },
      });
      if (uv?.isUsed) throw new AppError('Voucher sudah pernah kamu gunakan', 400);

      if (voucher.discountPercent) {
        discountAmount = Math.floor((totalPrice * voucher.discountPercent) / 100);
      } else if (voucher.discountAmount) {
        discountAmount = Math.min(Number(voucher.discountAmount), totalPrice);
      }

      // Mark voucher used
      await tx.voucher.update({ where: { id: voucher.id }, data: { usedCount: { increment: 1 } } });
      if (uv) {
        await tx.userVoucher.update({ where: { id: uv.id }, data: { isUsed: true, usedAt: new Date() } });
      }
      voucherCode = voucher.code;
    }

    // 4. Validate points
    const activePoints = await pointRepo.getActivePointsByUser(data.userId);
    if (data.pointsUsed > 0 && data.pointsUsed > activePoints) {
      throw new AppError(`Poin tidak mencukupi. Saldo aktif: ${activePoints}`, 400);
    }

    // 5. Final price
    const afterDiscount = totalPrice - discountAmount;
    const finalPrice = Math.max(0, afterDiscount - data.pointsUsed);

    // 6. Create transaction
    const transaction = await tx.transaction.create({
      data: {
        userId: data.userId,
        eventId: data.eventId,
        ticketTypeId: data.ticketTypeId,
        quantity: data.quantity,
        totalPrice,
        pointsUsed: data.pointsUsed,
        voucherCode,
        discountAmount,
        finalPrice,
        status: finalPrice === 0 ? 'PAID' : 'WAITING_PAYMENT',
        expiredAt: finalPrice > 0 ? new Date(Date.now() + 2 * 60 * 60 * 1000) : undefined, // 2hr payment window
      },
      include: { event: { select: { id: true, title: true } } },
    });

    // 7. Mark points as used
    if (data.pointsUsed > 0) {
      const pointIds = await pointRepo.getUsablePoints(data.userId, data.pointsUsed);
      await tx.userPoint.updateMany({ where: { id: { in: pointIds } }, data: { isUsed: true } });
    }

    // 8. Decrement event seats
    await tx.event.update({ where: { id: data.eventId }, data: { availableSeats: { decrement: data.quantity } } });

    return transaction;
  });
};

export const getMyTransactions = (userId: number) => txRepo.findTransactionsByUser(userId);

export const getTransactionById = async (id: number, userId: number) => {
  const tx = await txRepo.findTransactionById(id);
  if (!tx) throw new AppError('Transaksi tidak ditemukan', 404);
  if (tx.userId !== userId) throw new AppError('Akses ditolak', 403);
  return tx;
};

export const confirmPayment = async (id: number, userId: number, paymentProof?: string) => {
  const tx = await txRepo.findTransactionById(id);
  if (!tx) throw new AppError('Transaksi tidak ditemukan', 404);
  if (tx.userId !== userId) throw new AppError('Akses ditolak', 403);
  if (tx.status !== 'WAITING_PAYMENT') throw new AppError('Status transaksi tidak valid untuk konfirmasi', 400);
  return txRepo.updateTransactionStatus(id, 'PAID', paymentProof);
};

export const cancelTransaction = async (id: number, userId: number) => {
  const tx = await txRepo.findTransactionById(id);
  if (!tx) throw new AppError('Transaksi tidak ditemukan', 404);
  if (tx.userId !== userId) throw new AppError('Akses ditolak', 403);
  if (!['PENDING', 'WAITING_PAYMENT'].includes(tx.status)) throw new AppError('Transaksi tidak bisa dibatalkan', 400);

  // Refund seats
  await prisma.event.update({ where: { id: tx.eventId }, data: { availableSeats: { increment: tx.quantity } } });
  return txRepo.updateTransactionStatus(id, 'CANCELLED');
};
