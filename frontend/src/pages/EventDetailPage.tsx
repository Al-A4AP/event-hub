import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Event } from '../types/event.types';
import { getEventById } from '../services/event.service';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime } from '../utils/formatDate';
import Spinner from '../components/common/Spinner';

const StarRating = ({ rating, total }: { rating: number; total?: number }) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map(star => (
      <svg key={star} className={`w-5 h-5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="text-base font-bold text-gray-800">{rating.toFixed(1)}</span>
    {total !== undefined && <span className="text-sm text-gray-500">({total} ulasan)</span>}
  </div>
);

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getEventById(id).then(data => {
      setEvent(data);
      if (data?.ticketTypes?.length) setSelectedTicket(data.ticketTypes[0].id);
    }).finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen pt-16 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🎫</div>
        <h2 className="text-2xl font-bold text-gray-900">Event tidak ditemukan</h2>
        <Link to="/" className="text-blue-600 hover:underline font-medium">← Kembali ke beranda</Link>
      </div>
    );
  }

  const selectedTicketData = event.ticketTypes?.find(t => t.id === selectedTicket);
  const price = event.isFree ? 0 : (selectedTicketData?.price ?? event.price);
  const totalPrice = price * quantity;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Pembelian</h3>
              <p className="text-gray-500 text-sm">Pastikan detail pesanan kamu sudah benar</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Event</span>
                <span className="font-semibold text-right max-w-[180px] text-gray-900 line-clamp-1">{event.title}</span>
              </div>
              {selectedTicketData && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipe Tiket</span>
                  <span className="font-semibold text-gray-900">{selectedTicketData.name}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Jumlah</span>
                <span className="font-semibold text-gray-900">{quantity} tiket</span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-blue-600 text-base">
                  {event.isFree ? 'GRATIS' : formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => { setShowConfirm(false); navigate('/'); }}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-md"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors group">
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Event
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT CONTENT ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative rounded-3xl overflow-hidden h-72 md:h-96 shadow-xl">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full gradient-brand flex items-center justify-center">
                  <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 text-blue-700 shadow">
                  {event.category.name}
                </span>
                {event.isFree && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500 text-white shadow">
                    GRATIS
                  </span>
                )}
              </div>
            </div>

            {/* Title & Rating */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">{event.title}</h1>

              {event.averageRating !== undefined && event.averageRating > 0 && (
                <div className="mb-5">
                  <StarRating rating={event.averageRating} total={event.totalReviews} />
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
                    label: 'Tanggal Mulai',
                    value: formatDateTime(event.startDate),
                    color: 'text-blue-600 bg-blue-50',
                  },
                  {
                    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
                    label: 'Lokasi',
                    value: event.location,
                    color: 'text-rose-500 bg-rose-50',
                  },
                  {
                    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
                    label: 'Kursi Tersedia',
                    value: `${event.availableSeats} kursi`,
                    color: 'text-violet-600 bg-violet-50',
                  },
                  {
                    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
                    label: 'Penyelenggara',
                    value: event.organizer.name,
                    color: 'text-amber-600 bg-amber-50',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-0.5">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Tentang Event</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR: TICKET BOOKING ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Pesan Tiket</h3>

              {/* Ticket Type Selection */}
              {event.ticketTypes && event.ticketTypes.length > 0 ? (
                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Pilih Tipe Tiket
                  </label>
                  <div className="space-y-2">
                    {event.ticketTypes.map(ticket => (
                      <button
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket.id)}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${selectedTicket === ticket.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-100 hover:border-gray-200'
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{ticket.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{ticket.quota} tersedia</p>
                          </div>
                          <span className="text-sm font-bold text-blue-600">
                            {formatCurrency(ticket.price)}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-5">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Tiket Standard</p>
                  <p className="text-2xl font-extrabold text-blue-600">
                    {event.isFree ? 'GRATIS' : formatCurrency(event.price)}
                  </p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Jumlah Tiket
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-lg transition-all"
                  >
                    −
                  </button>
                  <span className="text-lg font-bold text-gray-900 min-w-[2rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(event.availableSeats, quantity + 1))}
                    className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-lg transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-4 mb-5">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Harga per tiket</span>
                  <span className="font-semibold text-gray-700">
                    {event.isFree ? 'Gratis' : formatCurrency(price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-500">Jumlah</span>
                  <span className="font-semibold text-gray-700">× {quantity}</span>
                </div>
                <div className="flex justify-between border-t border-blue-100 pt-3">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-extrabold text-blue-600">
                    {event.isFree ? 'GRATIS' : formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-base"
              >
                {event.isFree ? '🎟️ Daftar Gratis' : '🛒 Beli Tiket'}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                {event.availableSeats} kursi tersedia • Daftar sekarang!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
