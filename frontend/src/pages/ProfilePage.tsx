import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyTransactions, cancelTransaction } from '../services/transaction.service';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Spinner from '../components/common/Spinner';
import api from '../config/api';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  WAITING_PAYMENT: { label: 'Belum Dibayar', color: 'bg-orange-100 text-orange-700' },
  PAID: { label: 'Lunas', color: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-gray-100 text-gray-500' },
  REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
};

const ProfilePage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'tickets' | 'points'>('profile');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [txRes, meRes] = await Promise.all([
          getMyTransactions(),
          api.get('/api/auth/me'),
        ]);
        setTransactions(txRes || []);
        // Points from user data (if available)
        setPoints(meRes.data.data?.totalPoints || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Yakin ingin membatalkan transaksi ini?')) return;
    try {
      await cancelTransaction(id);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'CANCELLED' } : t));
    } catch (e: any) {
      alert(e.response?.data?.message || 'Gagal membatalkan transaksi');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="gradient-brand pt-10 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl font-extrabold text-white shadow-md">
            {user?.name[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
          <p className="text-blue-100 text-sm mt-1">{user?.email}</p>
          <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${user?.role === 'ORGANIZER' ? 'bg-violet-200 text-violet-800' : 'bg-blue-200 text-blue-800'}`}>
            {user?.role === 'ORGANIZER' ? '🎫 Organizer' : '👤 Customer'}
          </span>
        </div>
      </div>

      {/* Tab cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-8">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { key: 'profile', icon: '👤', label: 'Profil' },
            { key: 'tickets', icon: '🎫', label: `Tiket (${transactions.length})` },
            { key: 'points', icon: '⭐', label: 'Poin' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`bg-white rounded-2xl p-4 text-center border-2 transition-all shadow-sm ${activeTab === tab.key ? 'border-blue-500 shadow-blue-100' : 'border-transparent hover:border-gray-200'}`}
            >
              <div className="text-2xl mb-1">{tab.icon}</div>
              <div className={`text-xs font-bold ${activeTab === tab.key ? 'text-blue-600' : 'text-gray-600'}`}>{tab.label}</div>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <>
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Akun</h2>
                {[
                  { label: 'Nama Lengkap', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Role', value: user?.role },
                ].map(item => (
                  <div key={item.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500 font-medium">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Kode Referral Kamu</p>
                  <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-4">
                    <code className="text-blue-700 font-extrabold text-base tracking-wider flex-1">{user?.referralCode}</code>
                    <button
                      onClick={() => { navigator.clipboard.writeText(user?.referralCode || ''); alert('Kode referral disalin!'); }}
                      className="text-xs font-bold text-blue-600 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Salin
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Bagikan kode ini ke teman. Kamu akan mendapat 10.000 poin per teman yang mendaftar!</p>
                </div>
              </div>
            )}

            {/* Tickets Tab */}
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
                    <div className="text-5xl mb-3">🎫</div>
                    <h3 className="text-lg font-bold text-gray-800">Belum ada tiket</h3>
                    <p className="text-gray-500 text-sm mt-1">Cari event seru dan pesan tiketmu sekarang!</p>
                  </div>
                ) : transactions.map(tx => {
                  const s = STATUS_CONFIG[tx.status] || { label: tx.status, color: 'bg-gray-100 text-gray-600' };
                  return (
                    <div key={tx.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-sm leading-snug max-w-xs">{tx.event?.title}</h3>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ml-2 shrink-0 ${s.color}`}>{s.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>🗓️ {formatDate(tx.event?.startDate)}</span>
                          <span>📍 {tx.event?.location}</span>
                          <span>🎟️ {tx.quantity} tiket</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-base font-extrabold text-blue-600">
                            {Number(tx.finalPrice) === 0 ? 'GRATIS' : formatCurrency(Number(tx.finalPrice))}
                          </span>
                          {['WAITING_PAYMENT', 'PENDING'].includes(tx.status) && (
                            <button onClick={() => handleCancel(tx.id)} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-semibold">
                              Batalkan
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Points Tab */}
            {activeTab === 'points' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="text-center mb-6">
                  <div className="text-5xl font-extrabold text-gradient mb-2">{points.toLocaleString('id-ID')}</div>
                  <p className="text-gray-500 text-sm">Total Poin Aktif</p>
                  <p className="text-xs text-gray-400 mt-1">1 Poin = Rp 1 diskon saat checkout</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">Cara Dapat Poin</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">✅ Referral teman → <strong>+10.000 poin</strong></li>
                    <li className="flex items-center gap-2">✅ Poin berlaku selama <strong>3 bulan</strong></li>
                    <li className="flex items-center gap-2">✅ Kode referralmu: <code className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{user?.referralCode}</code></li>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
