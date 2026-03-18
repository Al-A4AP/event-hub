import { AppError } from '../middlewares/error.middleware';
import * as eventRepo from '../repositories/event.repository';
import * as ticketRepo from '../repositories/voucher.repository';
import { generateSlug } from '../utils/generators';
import { EventFilters } from '../repositories/event.repository';
import { prisma } from '../config/database';

export const getPublishedEvents = (filters: EventFilters) =>
  eventRepo.findPublishedEvents(filters);

export const getEventDetail = async (id: number) => {
  const event = await eventRepo.findEventById(id);
  if (!event) throw new AppError('Event tidak ditemukan', 404);

  const totalRatings = event.reviews.length;
  const avgRating = totalRatings > 0
    ? event.reviews.reduce((s, r) => s + r.rating, 0) / totalRatings
    : 0;

  return { ...event, averageRating: Math.round(avgRating * 10) / 10, totalReviews: totalRatings };
};

export const createEvent = async (organizerId: number, body: {
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  price?: number;
  isFree?: boolean;
  availableSeats: number;
  imageUrl?: string;
  ticketTypes?: Array<{ name: string; price: number; quota: number; description?: string }>;
}) => {
  const slug = generateSlug(body.title);
  const price = body.isFree ? 0 : (body.price ?? 0);

  const event = await prisma.event.create({
    data: {
      organizerId,
      title: body.title,
      slug,
      description: body.description,
      category: body.category,
      location: body.location,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      price,
      isFree: body.isFree ?? price === 0,
      availableSeats: body.availableSeats,
      totalSeats: body.availableSeats,
      imageUrl: body.imageUrl,
      status: 'DRAFT',
      ticketTypes: body.ticketTypes ? {
        create: body.ticketTypes.map(tt => ({
          name: tt.name,
          price: tt.price,
          quota: tt.quota,
          availableSeats: tt.quota,
          description: tt.description,
        })),
      } : undefined,
    },
    include: { ticketTypes: true },
  });
  return event;
};

export const updateEvent = async (id: number, organizerId: number, body: Partial<{
  title: string; description: string; category: string; location: string;
  startDate: string; endDate: string; price: number; isFree: boolean;
  availableSeats: number; imageUrl: string; status: string;
}>) => {
  const event = await eventRepo.findEventById(id);
  if (!event) throw new AppError('Event tidak ditemukan', 404);
  if (event.organizer.id !== organizerId) throw new AppError('Anda bukan pemilik event ini', 403);

  const updateData: Record<string, unknown> = { ...body };
  if (body.startDate) updateData.startDate = new Date(body.startDate);
  if (body.endDate) updateData.endDate = new Date(body.endDate);
  delete updateData.startDate;
  delete updateData.endDate;

  return prisma.event.update({
    where: { id },
    data: {
      ...updateData,
      ...(body.startDate && { startDate: new Date(body.startDate) }),
      ...(body.endDate && { endDate: new Date(body.endDate) }),
    } as Record<string, unknown> as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });
};

export const publishEvent = async (id: number, organizerId: number) => {
  const event = await eventRepo.findEventById(id);
  if (!event) throw new AppError('Event tidak ditemukan', 404);
  if (event.organizer.id !== organizerId) throw new AppError('Anda bukan pemilik event ini', 403);
  return prisma.event.update({ where: { id }, data: { status: 'PUBLISHED' } });
};


export const deleteEvent = async (id: number, organizerId: number) => {
  const event = await eventRepo.findEventById(id);
  if (!event) throw new AppError('Event tidak ditemukan', 404);
  if (event.organizer.id !== organizerId) throw new AppError('Anda bukan pemilik event ini', 403);
  if (event.status === 'PUBLISHED') throw new AppError('Tidak bisa menghapus event yang sudah dipublikasikan', 400);
  return eventRepo.deleteEvent(id);
};

export const getOrganizerEvents = (organizerId: number) =>
  eventRepo.findEventsByOrganizer(organizerId);

export const getCategories = async () => {
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    select: { category: true },
    distinct: ['category'],
  });
  return events.map(e => e.category);
};
