import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthenticated, user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 gradient-brand rounded-xl flex items-center justify-center shadow-md group-hover:shadow-blue-200 transition-shadow">
              <span className="text-white font-extrabold text-sm">E</span>
            </div>
            <span className="font-extrabold text-lg text-gray-900">Event<span className="text-gradient">Hub</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Jelajahi</Link>
            {isOrganizer && (
              <>
                <Link to="/organizer/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                <Link to="/organizer/create-event" className="hover:text-blue-600 transition-colors">Buat Event</Link>
              </>
            )}
          </div>

          {/* Right: Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-50 transition-all border border-gray-100"
                >
                  <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user?.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user?.name}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-500">Login sebagai</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${user?.role === 'ORGANIZER' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user?.role === 'ORGANIZER' ? '🎫 Organizer' : '👤 Customer'}
                      </span>
                    </div>
                    <button onClick={() => { navigate('/profile'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      Profil Saya
                    </button>
                    {!isOrganizer && (
                      <button onClick={() => { navigate('/my-tickets'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        Tiket Saya
                      </button>
                    )}
                    {isOrganizer && (
                      <button onClick={() => { navigate('/organizer/dashboard'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Dashboard
                      </button>
                    )}
                    <div className="border-t border-gray-50 mt-1">
                      <button onClick={() => { logout(); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-3 py-2">Masuk</Link>
                <Link to="/register" className="text-sm font-bold px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg">
                  Daftar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">🎉 Jelajahi Event</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">👤 Profil</Link>
                {!isOrganizer && <Link to="/my-tickets" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">🎫 Tiket Saya</Link>}
                {isOrganizer && <Link to="/organizer/dashboard" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">📊 Dashboard</Link>}
                {isOrganizer && <Link to="/organizer/create-event" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">➕ Buat Event</Link>}
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">🚪 Keluar</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Masuk</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors">Daftar Gratis →</Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Dismiss dropdown on outside click */}
      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </nav>
  );
};

export default Navbar;
