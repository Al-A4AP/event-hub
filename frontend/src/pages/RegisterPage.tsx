import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'ORGANIZER',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }
    setIsLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        referralCode: form.referralCode || undefined,
      });
      navigate('/');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || 'Registrasi gagal, coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-7">
            <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-white font-extrabold text-xl">E</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Buat Akun Baru</h1>
            <p className="text-gray-500 text-sm mt-1">Bergabung dengan 500K+ pengguna EventHub</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-700 font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {(['CUSTOMER', 'ORGANIZER'] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${form.role === role ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
                >
                  {role === 'CUSTOMER' ? '👤 Peserta' : '🎫 Organizer'}
                </button>
              ))}
            </div>

            {[
              { key: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama kamu' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'kamu@email.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 karakter' },
              { key: 'confirmPassword', label: 'Konfirmasi Password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{field.label}</label>
                <input
                  type={field.type}
                  required
                  value={form[field.key as keyof typeof form]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors bg-gray-50 focus:bg-white"
                />
              </div>
            ))}

            {form.role === 'CUSTOMER' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Kode Referral <span className="text-gray-400 normal-case font-normal">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={form.referralCode}
                  onChange={e => setForm({ ...form, referralCode: e.target.value.toUpperCase() })}
                  placeholder="REF-XXXXXXXX"
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors bg-gray-50 focus:bg-white font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">Masukkan kode referral temanmu untuk mendapat voucher diskon 10%</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Mendaftar...</>
              ) : 'Daftar Sekarang →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
