import { Link } from 'react-router-dom';
import type { Event } from '../../types/event.types';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDayMonth } from '../../utils/formatDate';

interface EventCardProps {
  event: Event;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <svg
        key={star}
        className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
  </div>
);

const EventCard = ({ event }: EventCardProps) => {
  const { day, month } = formatDayMonth(event.startDate);
  const seatsLow = event.availableSeats <= 20;

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full gradient-card flex items-center justify-center">
              <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-blue-700 shadow-sm">
              {event.category.name}
            </span>
          </div>
          {event.isFree && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
                GRATIS
              </span>
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white rounded-xl shadow-md text-center px-3 py-1.5 min-w-[50px]">
              <div className="text-lg font-bold text-blue-600 leading-none">{day}</div>
              <div className="text-xs font-semibold text-gray-500 uppercase">{month}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{event.location.split(',').slice(-1)[0].trim()}</span>
          </div>

          <div className="flex-1" />

          {/* Rating */}
          {event.averageRating !== undefined && event.averageRating > 0 && (
            <div className="mb-3">
              <StarRating rating={event.averageRating} />
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div>
              {event.isFree ? (
                <span className="text-base font-bold text-emerald-600">Gratis</span>
              ) : (
                <span className="text-base font-bold text-gray-900">{formatCurrency(event.price)}</span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {seatsLow ? (
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full animate-pulse-slow">
                  🔥 {event.availableSeats} tersisa
                </span>
              ) : (
                <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                  {event.availableSeats} kursi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
