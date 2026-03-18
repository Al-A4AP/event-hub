import { prisma } from '../config/database';
import * as txRepo from '../repositories/transaction.repository';
import * as eventRepo from '../repositories/event.repository';
import { AppError } from '../middlewares/error.middleware';

export const getDashboardStats = async (organizerId: number, period: 'daily' | 'monthly' | 'yearly') => {
  const txData = await txRepo.getTransactionStats(organizerId, period);

  // Aggregate by period label
  const groupedMap: Record<string, { revenue: number; attendees: number }> = {};
  for (const t of txData) {
    let label: string;
    const d = new Date(t.createdAt);
    if (period === 'daily') label = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    else if (period === 'monthly') label = d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    else label = d.getFullYear().toString();

    if (!groupedMap[label]) groupedMap[label] = { revenue: 0, attendees: 0 };
    groupedMap[label].revenue += Number(t.finalPrice);
    groupedMap[label].attendees += 1;
  }

  const chartData = Object.entries(groupedMap).map(([label, val]) => ({ label, ...val }));

  const totalRevenue = txData.reduce((s, t) => s + Number(t.finalPrice), 0);
  const totalAttendees = txData.length;
  const totalEvents = await prisma.event.count({ where: { organizerId } });

  return { totalEvents, totalAttendees, totalRevenue, chartData };
};

export const getDashboardEvents = (organizerId: number) =>
  eventRepo.findEventsByOrganizer(organizerId);

export const getEventAttendees = async (eventId: number, organizerId: number) => {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) throw new AppError('Event tidak ditemukan', 404);
  if (event.organizerId !== organizerId) throw new AppError('Akses ditolak', 403);
  return prisma.transaction.findMany({
    where: { eventId, status: { in: ['PAID', 'WAITING_PAYMENT'] } },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
};
