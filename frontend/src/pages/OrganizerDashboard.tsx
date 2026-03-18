import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Spinner from '../components/common/Spinner';

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  DRAFT: { text: 'Draft', color: 'bg-gray-100 text-gray-600' },
  PUBLISHED: { text: 'Aktif', color: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { text: 'Dibatalkan', color: 'bg-red-100 text-red-600' },
  COMPLETED: { text: 'Selesai', color: 'bg-blue-100 text-blue-700' },
};

const OrganizerDashboard = () => {
  const [stats, setStats] = useState({ totalEvents: 0, totalAttendees: 0, totalRevenue: 0, chartData: [] as any[] });
  const [events, setEvents] = useState<any[]>([]);
  const [period, setPeriod] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, eventsRes] = await Promise.all([
          api.get(`/api/dashboard/stats?period=${period}`),
          api.get('/api/dashboard/events'),
        ]);
        setStats(statsRes.data.data);
        setEvents(eventsRes.data.data || []);
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchData();
  }, [period]);

  const handlePublish = async (id: number) => {
    try {
      await api.patch(`/api/events/${id}/publish`);
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'PUBLISHED' } : e));
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal publish'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus event ini?')) return;
    try {
      await api.delete(`/api/events/${id}`);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (e: any) { alert(e.response?.data?.message || 'Gagal menghapus'); }
  };

  const STAT_CARDS = [
    { icon: '📅', label: 'Total Event', value: stats.totalEvents, color: 'from-blue-500 to-blue-600' },
    { icon: '👥', label: 'Total Peserta', value: stats.totalAttendees, color: 'from-violet-500 to-violet-600' },
    { icon: '💰', label: 'Total Pendapatan', value: formatCurrency(stats.totalRevenue), color: 'from-emerald-500 to-emerald-600', isRev: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard Organizer</h1>
            <p className="text-gray-500 text-sm mt-0.5">Kelola event dan pantau statistikmu</p>
          </div>
          <Link to="/organizer/create-event"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-md text-sm">
            ➕ Buat Event Baru
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {STAT_CARDS.map(sc => (
                <div key={sc.label} className={`bg-gradient-to-br ${sc.color} rounded-2xl p-5 text-white shadow-md`}>
                  <div className="text-2xl mb-2">{sc.icon}</div>
                  <div className="text-2xl font-extrabold mb-0.5">{sc.isRev ? sc.value : String(sc.value)}</div>
                  <div className="text-sm opacity-80">{sc.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Chart (simple bar) */}
            {stats.chartData.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-gray-900">Grafik Pendapatan</h2>
                  <div className="flex gap-2">
                    {(['daily', 'monthly', 'yearly'] as const).map(p => (
                      <button key={p} onClick={() => setPeriod(p)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${period === p ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        {p === 'daily' ? 'Harian' : p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-end gap-2 h-32 overflow-x-auto pb-5">
                  {(() => {
                    const max = Math.max(...stats.chartData.map(d => d.revenue), 1);
                    return stats.chartData.slice(-12).map((d, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 min-w-[40px]">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all"
                          style={{ height: `${Math.max(4, (d.revenue / max) * 100)}px` }}
                          title={`${d.label}: ${formatCurrency(d.revenue)}`}
                        />
                        <span className="text-[9px] text-gray-400 text-center leading-tight">{d.label}</span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Events Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Event Saya ({events.length})</h2>
              </div>
              {events.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-bold text-gray-700">Belum ada event</p>
                  <p className="text-sm text-gray-500 mt-1">Buat event pertamamu sekarang!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Event', 'Tanggal', 'Kursi', 'Status', 'Aksi'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {events.map(ev => {
                        const s = STATUS_LABELS[ev.status] || { text: ev.status, color: 'bg-gray-100 text-gray-600' };
                        return (
                          <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4 max-w-[220px]">
                              <p className="font-semibold text-gray-900 truncate">{ev.title}</p>
                              <p className="text-xs text-gray-400">{ev.category} • {ev.location.split(',')[0]}</p>
                            </td>
                            <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{formatDate(ev.startDate)}</td>
                            <td className="px-5 py-4 text-gray-700 font-semibold text-xs">{ev.availableSeats}/{ev.totalSeats}</td>
                            <td className="px-5 py-4">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.color}`}>{s.text}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <Link to={`/events/${ev.id}`} className="text-xs text-blue-600 hover:underline font-medium">Lihat</Link>
                                {ev.status === 'DRAFT' && (
                                  <button onClick={() => handlePublish(ev.id)} className="text-xs text-emerald-600 hover:underline font-medium">Publish</button>
                                )}
                                {ev.status === 'DRAFT' && (
                                  <button onClick={() => handleDelete(ev.id)} className="text-xs text-red-500 hover:underline font-medium">Hapus</button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
