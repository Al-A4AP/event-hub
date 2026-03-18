export interface Category {
  id: string;
  name: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  quota: number;
  availableSeats: number;
  description?: string;
}

export interface Promotion {
  id: string;
  type: 'REFERRAL_CODE' | 'EARLY_BIRD';
  discountPercent?: number;
  discountAmount?: number;
  code?: string;
  startDate?: string;
  endDate?: string;
}

export interface Organizer {
  id: string;
  name: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  slug?: string;
  description: string;
  location: string;
  price: number;
  isFree: boolean;
  startDate: string;
  endDate: string;
  availableSeats: number;
  totalSeats?: number;
  imageUrl?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  category: Category;
  organizer: Organizer;
  ticketTypes?: TicketType[];
  promotions?: Promotion[];
  averageRating?: number;
  totalReviews?: number;
}

export interface EventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}
