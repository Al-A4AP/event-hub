import { useState, useEffect } from 'react';
import type { Event } from '../types/event.types';
import { getEvents, getFeaturedEvents } from '../services/event.service';
import useDebounce from '../hooks/useDebounce';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/events/SearchBar';
import EventFilters from '../components/events/EventFilters';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';

const STATS = [
  { value: '10K+', label: 'Event Aktif' },
  { value: '500K+', label: 'Pengguna Terdaftar' },
  { value: '34', label: 'Kota di Indonesia' },
  { value: '4.9★', label: 'Rating Platform' },
];

const HOW_IT_WORKS = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: 'Temukan Event',
    desc: 'Cari event sesuai minat dan lokasi kamu dengan mudah',
    color: 'from-blue-500 to-blue-600',
    step: '01',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: 'Pesan Tiket',
    desc: 'Pilih tiket dan selesaikan pembayaran dalam hitungan detik',
    color: 'from-violet-500 to-violet-600',
    step: '02',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Nikmati Event',
    desc: 'Hadiri event impianmu dan buat kenangan tak terlupakan',
    color: 'from-pink-500 to-pink-600',
    step: '03',
  },
];

const LandingPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [featured, setFeatured] = useState<Event[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput, 500);

  // Fetch featured events once
  useEffect(() => {
    getFeaturedEvents().then(setFeatured);
  }, []);

  // Fetch filtered events when filters change
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await getEvents({
          search: debouncedSearch,
          category,
          location,
          page,
          limit: 6,
        });
        setEvents(res.events);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [debouncedSearch, category, location, page]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, location]);

  const isFiltered = !!(debouncedSearch || category || location);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-brand opacity-95" />
        {/* Decorative blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-48 bg-violet-900/30 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Platform Event #1 di Indonesia
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Temukan & Hadiri<br />
            <span className="text-yellow-300">Event Impianmu</span>
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Dari konser musik hingga konferensi teknologi — temukan ribuan event menarik di seluruh Indonesia dan pesan tiket dalam hitungan detik.
          </p>

          {/* Search Bar */}
          <SearchBar value={searchInput} onChange={setSearchInput} />

          {/* Quick Category Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Musik', 'Teknologi', 'Bisnis', 'Olahraga', 'Gratis'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  if (tag === 'Gratis') {
                    setSearchInput('gratis');
                  } else {
                    setSearchInput(tag);
                  }
                }}
                className="glass text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/25 transition-all hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Wave */}
        <div className="relative">
          <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="fill-slate-50 w-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 -mt-2 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-extrabold text-gradient mb-1">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURED EVENTS
      ═══════════════════════════════════════════════════════ */}
      {!isFiltered && featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🔥 Event Terpopuler</h2>
              <p className="text-sm text-gray-500 mt-0.5">Jangan sampai ketinggalan!</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          MAIN EVENT DISCOVERY SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isFiltered ? 'Hasil Pencarian' : '🗓️ Semua Event Mendatang'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading ? 'Mencari...' : `${total} event ditemukan`}
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 self-start bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
            {(category || location) && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filter — Desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-20">
              <EventFilters
                selectedCategory={category}
                selectedLocation={location}
                onCategoryChange={setCategory}
                onLocationChange={setLocation}
              />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="md:hidden mb-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-md">
              <EventFilters
                selectedCategory={category}
                selectedLocation={location}
                onCategoryChange={(c) => { setCategory(c); setIsMobileFilterOpen(false); }}
                onLocationChange={(l) => { setLocation(l); setIsMobileFilterOpen(false); }}
              />
            </div>
          )}

          {/* Event Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Spinner size="lg" />
                <p className="text-sm text-gray-400 font-medium">Memuat event...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <EmptyState
                  title="Event tidak ditemukan"
                  description="Tidak ada event yang cocok dengan pencarian atau filter kamu. Coba kata kunci atau filter yang berbeda."
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {events.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="mt-10">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3 block">Cara Kerja</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mulai dalam 3 Langkah</h2>
          <p className="text-gray-500 mb-12 text-sm">Proses yang super mudah untuk kamu yang pertama kali menggunakan EventHub</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="relative flex flex-col items-center">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-9 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 to-transparent" />
                )}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg mb-5 relative`}>
                  {item.icon}
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full text-xs font-extrabold text-gray-700 flex items-center justify-center shadow border border-gray-100">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl gradient-brand overflow-hidden p-10 md:p-16 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Siap Buat Event Sendiri?
              </h2>
              <p className="text-blue-100 mb-8 text-base leading-relaxed max-w-lg mx-auto">
                Bergabunglah dengan ribuan Event Organizer yang telah mempercayakan event mereka ke EventHub. Gratis untuk memulai!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Buat Event Sekarang
                </button>
                <button className="px-8 py-3.5 glass text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/30">
                  Pelajari Lebih Lanjut
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
