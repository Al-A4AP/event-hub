import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Spinner from '../components/common/Spinner';

// Pages
import LandingPage from '../pages/LandingPage';
import EventDetailPage from '../pages/EventDetailPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import CreateEventPage from '../pages/CreateEventPage';
import OrganizerDashboard from '../pages/OrganizerDashboard';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
    <div className="text-8xl font-extrabold text-gradient">404</div>
    <h1 className="text-2xl font-bold text-gray-900">Halaman Tidak Ditemukan</h1>
    <p className="text-gray-500">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
    <a href="/" className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-md">
      Kembali ke Beranda
    </a>
  </div>
);

// Redirect logged-in users away from login/register
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />

            {/* Guest-only (redirect if logged in) */}
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

            {/* Protected — any authenticated user */}
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/my-tickets" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Protected — Organizer only */}
            <Route path="/organizer/dashboard" element={<ProtectedRoute requiredRole="ORGANIZER"><OrganizerDashboard /></ProtectedRoute>} />
            <Route path="/organizer/create-event" element={<ProtectedRoute requiredRole="ORGANIZER"><CreateEventPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
