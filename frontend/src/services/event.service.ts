import api from '../config/api';
import type { Event, EventsResponse, EventFilters } from '../types/event.types';

export const getEvents = async (filters: EventFilters): Promise<EventsResponse> => {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.location) params.set('location', filters.location);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const res = await api.get(`/api/events?${params.toString()}`);
  const { events, total, page, limit, totalPages } = res.data.data;

  return {
    events: events.map(mapEvent),
    pagination: { total, page, limit, totalPages },
  };
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const res = await api.get(`/api/events/${id}`);
    return mapEvent(res.data.data);
  } catch {
    return null;
  }
};

export const getFeaturedEvents = async (): Promise<Event[]> => {
  const res = await api.get('/api/events?limit=3&page=1');
  return (res.data.data.events || []).map(mapEvent);
};

export const getCategories = async (): Promise<{ id: string; name: string }[]> => {
  const res = await api.get('/api/events/categories');
  const cats: string[] = res.data.data || [];
  return cats.map(c => ({ id: c, name: c }));
};

// Locations are derived from event data — get unique ones
export const getLocations = async (): Promise<string[]> => {
  const res = await api.get('/api/events?limit=100&page=1');
  const events: ReturnType<typeof mapEvent>[] = (res.data.data.events || []).map(mapEvent);
  const locs = [...new Set(events.map(e => e.location.split(',').slice(-1)[0].trim()))];
  return locs;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapEvent = (e: any): Event => ({
  id: String(e.id),
  title: e.title,
  slug: e.slug,
  description: e.description,
  category: { id: e.category, name: e.category },
  location: e.location,
  startDate: e.startDate,
  endDate: e.endDate,
  price: Number(e.price),
  isFree: e.isFree,
  availableSeats: e.availableSeats,
  totalSeats: e.totalSeats,
  imageUrl: e.imageUrl || '',
  status: e.status,
  organizer: {
    id: String(e.organizer?.id ?? e.organizerId),
    name: e.organizer?.name ?? 'Organizer',
    avatar: e.organizer?.avatar,
  },
  ticketTypes: (e.ticketTypes || []).map((tt: any) => ({
    id: String(tt.id),
    name: tt.name,
    price: Number(tt.price),
    quota: tt.quota,
    availableSeats: tt.availableSeats,
    description: tt.description,
  })),
  promotions: [],
  averageRating: e.averageRating ?? (e.reviews?.length
    ? e.reviews.reduce((s: number, r: any) => s + r.rating, 0) / e.reviews.length
    : 0),
  totalReviews: e.totalReviews ?? e.reviews?.length ?? 0,
});
