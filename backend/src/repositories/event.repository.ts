import { prisma } from '../config/database';
import { EventStatus, Prisma } from '@prisma/client';

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}

export const findPublishedEvents = async (filters: EventFilters) => {
  const { search, category, location, page = 1, limit = 10 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.EventWhereInput = {
    status: 'PUBLISHED',
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category: { equals: category, mode: 'insensitive' } }),
    ...(location && { location: { contains: location, mode: 'insensitive' } }),
  };

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startDate: 'asc' },
      include: {
        organizer: { select: { id: true, name: true, avatar: true } },
        ticketTypes: true,
        reviews: { select: { rating: true } },
      },
    }),
    prisma.event.count({ where }),
  ]);

  return { events, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findEventById = (id: number) =>
  prisma.event.findUnique({
    where: { id },
    include: {
      organizer: { select: { id: true, name: true, avatar: true } },
      ticketTypes: true,
      reviews: {
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
      },
      vouchers: true,
    },
  });

export const findEventBySlug = (slug: string) =>
  prisma.event.findUnique({ where: { slug } });

export const findEventsByOrganizer = (organizerId: number, status?: EventStatus) =>
  prisma.event.findMany({
    where: { organizerId, ...(status && { status }) },
    include: {
      ticketTypes: true,
      _count: { select: { transactions: true, reviews: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

export const createEvent = (data: Prisma.EventCreateInput) =>
  prisma.event.create({ data, include: { ticketTypes: true } });

export const updateEvent = (id: number, data: Prisma.EventUpdateInput) =>
  prisma.event.update({ where: { id }, data });

export const deleteEvent = (id: number) =>
  prisma.event.delete({ where: { id } });
