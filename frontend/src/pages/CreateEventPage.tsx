import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const CATEGORIES = ['Musik', 'Teknologi', 'Bisnis', 'Olahraga', 'Seni', 'Kuliner', 'Pendidikan', 'Festival'];

interface TicketTypeForm {
  name: string;
  price: string;
  quota: string;
  description: string;
}

const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Teknologi',
    location: '',
    startDate: '',
    endDate: '',
    price: '',
    isFree: false,
    availableSeats: '',
    imageUrl: '',
  });
  const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>([]);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState<TicketTypeForm>({ name: '', price: '', quota: '', description: '' });

  const addTicket = () => {
    if (!newTicket.name || !newTicket.quota) return;
    setTicketTypes(prev => [...prev, newTicket]);
    setNewTicket({ name: '', price: '', quota: '', description: '' });
    setShowTicketForm(false);
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.post('/api/events', {
        ...form,
        price: form.isFree ? 0 : Number(form.price),
        availableSeats: Number(form.availableSeats),
        ticketTypes: ticketTypes.map(tt => ({
          name: tt.name,
          price: Number(tt.price) || 0,
          quota: Number(tt.quota),
          description: tt.description,
        })),
      });
      const eventId = res.data.data.id;
      if (publish) {
        await api.patch(`/api/events/${eventId}/publish`);
      }
      navigate('/organizer/dashboard');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Gagal membuat event');
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== 'ORGANIZER') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">Akses Ditolak</p>
          <p className="text-gray-500 mt-2">Hanya Organizer yang bisa membuat event</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Buat Event Baru</h1>
          <p className="text-gray-500 text-sm mt-1">Isi detail event kamu, lalu simpan sebagai draft atau langsung publish</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700 font-medium">{error}</div>}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Judul Event *</label>
            <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Nama event yang menarik..."
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Deskripsi *</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={5} placeholder="Ceritakan tentang event kamu..."
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Kategori *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Lokasi *</label>
              <input type="text" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="Jakarta Convention Center, Jakarta"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Tanggal Mulai *</label>
              <input type="datetime-local" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Tanggal Selesai *</label>
              <input type="datetime-local" required value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Jumlah Kursi *</label>
              <input type="number" required min={1} value={form.availableSeats} onChange={e => setForm({ ...form, availableSeats: e.target.value })}
                placeholder="500"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">URL Gambar</label>
              <input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center gap-3 mb-4">
              <input type="checkbox" id="isFree" checked={form.isFree} onChange={e => setForm({ ...form, isFree: e.target.checked })}
                className="w-4 h-4 accent-blue-600 cursor-pointer" />
              <label htmlFor="isFree" className="text-sm font-semibold text-gray-700 cursor-pointer">Event ini GRATIS</label>
            </div>
            {!form.isFree && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Harga Tiket (IDR)</label>
                <input type="number" min={0} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="150000"
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
              </div>
            )}
          </div>

          {/* Ticket Types */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Tipe Tiket (Opsional)</h3>
              <button type="button" onClick={() => setShowTicketForm(true)} className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                + Tambah Tipe Tiket
              </button>
            </div>
            {ticketTypes.map((tt, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{tt.name}</p>
                  <p className="text-xs text-gray-500">{tt.quota} kursi • {tt.price ? `Rp ${Number(tt.price).toLocaleString('id-ID')}` : 'Gratis'}</p>
                </div>
                <button type="button" onClick={() => setTicketTypes(prev => prev.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            {showTicketForm && (
              <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Nama tipe (e.g. VIP)" value={newTicket.name} onChange={e => setNewTicket({ ...newTicket, name: e.target.value })}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white" />
                  <input type="number" placeholder="Harga (0 = gratis)" value={newTicket.price} onChange={e => setNewTicket({ ...newTicket, price: e.target.value })}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white" />
                  <input type="number" placeholder="Jumlah kuota" value={newTicket.quota} onChange={e => setNewTicket({ ...newTicket, quota: e.target.value })}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white" />
                  <input placeholder="Deskripsi (opsional)" value={newTicket.description} onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-white" />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={addTicket} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">Tambahkan</button>
                  <button type="button" onClick={() => setShowTicketForm(false)} className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">Batal</button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={(e) => handleSubmit(e, false)} disabled={isLoading}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50">
              💾 Simpan Draft
            </button>
            <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              🚀 Publish Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
