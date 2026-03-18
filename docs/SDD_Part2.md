# SOFTWARE DESIGN DOCUMENT — PART 2
## Event Management Platform — MVP
*(Lanjutan dari Part 1)*

---

# 6. BACKEND FOLDER STRUCTURE

## 6.1 Struktur Folder Lengkap

```
backend/
├── prisma/
│   ├── schema.prisma           # Definisi schema database Prisma
│   ├── seed.ts                  # Script untuk mengisi data awal (sample data)
│   └── migrations/              # Folder migrasi otomatis Prisma
├── src/
│   ├── config/
│   │   ├── database.ts          # Inisialisasi Prisma Client singleton
│   │   └── env.ts               # Validasi dan ekspor environment variables
│   ├── controllers/
│   │   ├── auth.controller.ts   # Handler register, login, getMe
│   │   ├── event.controller.ts  # Handler CRUD event & promosi
│   │   ├── transaction.controller.ts  # Handler transaksi tiket
│   │   ├── review.controller.ts # Handler ulasan & rating
│   │   ├── point.controller.ts  # Handler poin pengguna
│   │   ├── coupon.controller.ts # Handler kupon pengguna
│   │   └── dashboard.controller.ts    # Handler statistik organizer
│   ├── services/
│   │   ├── auth.service.ts      # Logika register, login, generate token
│   │   ├── event.service.ts     # Logika bisnis event
│   │   ├── transaction.service.ts  # Logika pembelian tiket (SQL tx)
│   │   ├── review.service.ts    # Logika validasi & penyimpanan review
│   │   ├── point.service.ts     # Logika hitung & expire poin
│   │   ├── referral.service.ts  # Logika generate & validasi referral
│   │   └── dashboard.service.ts # Logika agregasi statistik
│   ├── repositories/
│   │   ├── user.repository.ts   # Query Prisma untuk tabel users
│   │   ├── event.repository.ts  # Query Prisma untuk tabel events
│   │   ├── transaction.repository.ts # Query Prisma untuk transactions
│   │   ├── review.repository.ts # Query Prisma untuk reviews
│   │   ├── point.repository.ts  # Query Prisma untuk points
│   │   └── coupon.repository.ts # Query Prisma untuk coupons
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # Verifikasi JWT token
│   │   ├── role.middleware.ts   # Guard berdasarkan role pengguna
│   │   ├── validate.middleware.ts # Validasi request body (Zod/Joi)
│   │   └── error.middleware.ts  # Global error handler Express
│   ├── routes/
│   │   ├── index.ts             # Agregasi semua router
│   │   ├── auth.routes.ts       # Rute autentikasi
│   │   ├── event.routes.ts      # Rute event
│   │   ├── transaction.routes.ts # Rute transaksi
│   │   ├── review.routes.ts     # Rute ulasan
│   │   ├── point.routes.ts      # Rute poin
│   │   ├── coupon.routes.ts     # Rute kupon
│   │   └── dashboard.routes.ts  # Rute dashboard organizer
│   ├── utils/
│   │   ├── bcrypt.ts            # Helper hash & compare password
│   │   ├── jwt.ts               # Helper generate & verify JWT
│   │   ├── referralCode.ts      # Generator kode referral unik
│   │   ├── couponCode.ts        # Generator kode kupon unik
│   │   ├── formatCurrency.ts    # Format angka ke IDR
│   │   └── response.ts          # Helper standarisasi format response JSON
│   ├── types/
│   │   ├── express.d.ts         # Deklarasi tambahan untuk Express request
│   │   └── index.ts             # Tipe custom shared di seluruh backend
│   └── app.ts                   # Setup Express app, middleware global, routes
├── .env                         # Environment variables (JANGAN di-commit)
├── .env.example                 # Template environment variables
├── .gitignore
├── package.json
├── tsconfig.json                # Konfigurasi TypeScript
└── nodemon.json                 # Konfigurasi hot-reload development
```

## 6.2 Penjelasan Fungsi Setiap Folder

| Folder/File | Fungsi |
|-------------|--------|
| `prisma/` | Semua hal terkait database: schema, migrasi, seeder |
| `src/config/` | Konfigurasi global aplikasi (koneksi DB, env vars) |
| `src/controllers/` | Menerima HTTP request dan mengirim response. Tidak berisi business logic |
| `src/services/` | Tempat seluruh business logic. Dipanggil oleh controller |
| `src/repositories/` | Abstraksi layer query database. Hanya berbicara dengan Prisma |
| `src/middlewares/` | Fungsi yang dieksekusi sebelum/sesudah handler: auth, validasi, error handling |
| `src/routes/` | Definisi routing endpoint dan assignment middleware |
| `src/utils/` | Fungsi utility reusable (hash, JWT, format, dsb.) |
| `src/types/` | Definisi tipe TypeScript custom |
| `src/app.ts` | Entry point Express, inisialisasi middleware global dan mount routing |

---

# 7. FRONTEND FOLDER STRUCTURE

## 7.1 Struktur Folder Lengkap

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── images/              # Gambar statis (logo, ilustrasi default)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx        # Komponen button reusable
│   │   │   ├── Input.tsx         # Komponen input reusable
│   │   │   ├── Modal.tsx         # Komponen popup/konfirmasi dialog
│   │   │   ├── Spinner.tsx       # Loading spinner
│   │   │   ├── Pagination.tsx    # Komponen pagination
│   │   │   ├── EmptyState.tsx    # Tampilan saat data kosong
│   │   │   └── Badge.tsx         # Badge status event/payment
│   │   ├── layout/
│   │   │   ├── Navbar.tsx        # Navigation bar utama
│   │   │   ├── Footer.tsx        # Footer halaman
│   │   │   └── DashboardLayout.tsx # Layout khusus organizer dashboard
│   │   ├── events/
│   │   │   ├── EventCard.tsx     # Kartu preview event di listing
│   │   │   ├── EventFilters.tsx  # Komponen filter (kategori, lokasi)
│   │   │   ├── SearchBar.tsx     # Search bar dengan debounce
│   │   │   ├── EventTicketSelector.tsx # Pemilih tipe tiket
│   │   │   └── ReviewCard.tsx    # Kartu ulasan pengguna
│   │   └── dashboard/
│   │       ├── StatsCard.tsx     # Kartu statistik (revenue, attendees)
│   │       ├── RevenueChart.tsx  # Grafik pendapatan (Recharts)
│   │       └── AttendeeTable.tsx # Tabel daftar peserta
│   ├── pages/
│   │   ├── LandingPage.tsx       # Halaman utama / event discovery
│   │   ├── EventDetailPage.tsx   # Halaman detail event
│   │   ├── CheckoutPage.tsx      # Halaman pembelian tiket
│   │   ├── TransactionSuccessPage.tsx # Halaman konfirmasi sukses
│   │   ├── LoginPage.tsx         # Halaman login
│   │   ├── RegisterPage.tsx      # Halaman registrasi
│   │   ├── ProfilePage.tsx       # Halaman profil pengguna
│   │   ├── MyTicketsPage.tsx     # Halaman riwayat tiket customer
│   │   ├── CreateEventPage.tsx   # Form buat event (Organizer)
│   │   ├── EditEventPage.tsx     # Form edit event (Organizer)
│   │   ├── DashboardPage.tsx     # Dashboard utama organizer
│   │   ├── DashboardAttendeesPage.tsx # Daftar peserta per event
│   │   └── NotFoundPage.tsx      # Halaman 404
│   ├── services/
│   │   ├── api.ts                # Instance Axios dengan interceptors
│   │   ├── auth.service.ts       # Fungsi API call auth (login, register)
│   │   ├── event.service.ts      # Fungsi API call events
│   │   ├── transaction.service.ts # Fungsi API call transaksi
│   │   ├── review.service.ts     # Fungsi API call ulasan
│   │   ├── point.service.ts      # Fungsi API call poin
│   │   └── dashboard.service.ts  # Fungsi API call dashboard
│   ├── hooks/
│   │   ├── useDebounce.ts        # Custom hook debounce untuk search
│   │   ├── useAuth.ts            # Hook akses AuthContext
│   │   ├── useEvents.ts          # Hook fetch & filter daftar event
│   │   └── usePagination.ts      # Hook manajemen state pagination
│   ├── context/
│   │   └── AuthContext.tsx       # React Context untuk state autentikasi global
│   ├── types/
│   │   ├── user.types.ts         # Tipe User, AuthResponse
│   │   ├── event.types.ts        # Tipe Event, TicketType, Promotion
│   │   ├── transaction.types.ts  # Tipe Transaction, PaymentStatus
│   │   └── api.types.ts          # Tipe respons API generik
│   ├── utils/
│   │   ├── formatCurrency.ts     # Format angka ke format IDR
│   │   ├── formatDate.ts         # Format tanggal ke bahasa Indonesia
│   │   └── storage.ts            # Helper localStorage (token, user)
│   ├── router/
│   │   ├── index.tsx             # Konfigurasi React Router
│   │   └── ProtectedRoute.tsx    # Komponen guard route berdasarkan role
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point React + Vite
│   └── index.css                 # Import TailwindCSS v4
├── index.html
├── vite.config.ts               # Konfigurasi Vite
├── tailwind.config.ts           # Konfigurasi TailwindCSS v4
├── tsconfig.json                # Konfigurasi TypeScript
└── package.json
```

## 7.2 Penjelasan Fungsi Setiap Folder

| Folder | Fungsi |
|--------|--------|
| `components/common/` | Komponen UI dasar yang digunakan di seluruh halaman |
| `components/layout/` | Komponen struktur halaman (Navbar, Footer, Layout) |
| `components/events/` | Komponen khusus fitur event discovery |
| `components/dashboard/` | Komponen spesifik untuk dashboard organizer |
| `pages/` | Halaman-halaman utama aplikasi (satu file = satu route) |
| `services/` | Semua fungsi pemanggilan API backend |
| `hooks/` | Custom React hooks untuk logika reusable |
| `context/` | React Context untuk state management global |
| `types/` | Definisi tipe TypeScript untuk seluruh frontend |
| `utils/` | Fungsi helper (format angka, tanggal, storage) |
| `router/` | Konfigurasi routing dan protected route guard |

---

# 8. CORE CODE EXAMPLES

## 8.1 Backend: Express Server Setup (`src/app.ts`)

```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorMiddleware } from './middlewares/error.middleware';
import router from './routes/index';

const app: Application = express();

// Middleware Global
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount semua routes
app.use('/api/v1', router);

// Error handler harus di paling bawah
app.use(errorMiddleware);

export default app;
```

```typescript
// src/server.ts
import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
```

---

## 8.2 Backend: Auth Middleware (`src/middlewares/auth.middleware.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

interface JwtPayload {
  userId: string;
  role: string;
}

// Extend Express Request untuk menyimpan user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string; email: string };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Token tidak ditemukan' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, email: true },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'User tidak ditemukan' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};

// Middleware penjaga role
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke fitur ini',
      });
      return;
    }
    next();
  };
};
```

---

## 8.3 Backend: Transaction Service (`src/services/transaction.service.ts`)

```typescript
import { prisma } from '../config/database';

interface CreateTransactionDto {
  userId: string;
  eventId: string;
  ticketTypeId?: string;
  quantity: number;
  couponCode?: string;
  pointsUsed: number;
}

export const createTransactionService = async (dto: CreateTransactionDto) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Ambil data event
    const event = await tx.event.findUnique({ where: { id: dto.eventId } });
    if (!event) throw new Error('Event tidak ditemukan');
    if (event.availableSeats < dto.quantity) throw new Error('Kursi tidak mencukupi');

    // 2. Hitung harga dasar
    let basePrice = Number(event.price) * dto.quantity;
    let discountAmount = 0;

    // 3. Validasi dan aplikasikan kupon
    if (dto.couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: dto.couponCode } });
      if (!coupon || coupon.isUsed || coupon.expiredAt < new Date()) {
        throw new Error('Kupon tidak valid atau sudah expired');
      }
      if (coupon.userId !== dto.userId) throw new Error('Kupon bukan milik Anda');
      discountAmount = Math.floor((basePrice * coupon.discountPercent) / 100);
      // Tandai kupon sebagai terpakai
      await tx.coupon.update({ where: { id: coupon.id }, data: { isUsed: true } });
    }

    // 4. Validasi poin
    const activePoints = await tx.point.aggregate({
      where: { userId: dto.userId, type: 'EARNED', expiredAt: { gt: new Date() } },
      _sum: { amount: true },
    });
    const totalAvailablePoints = Number(activePoints._sum.amount ?? 0);
    if (dto.pointsUsed > totalAvailablePoints) throw new Error('Poin tidak mencukupi');
    if (dto.pointsUsed < 0) throw new Error('Poin tidak valid');

    // 5. Hitung harga final
    const afterDiscount = basePrice - discountAmount;
    const finalPrice = Math.max(0, afterDiscount - dto.pointsUsed);

    // 6. Buat transaksi
    const transaction = await tx.transaction.create({
      data: {
        userId: dto.userId,
        eventId: dto.eventId,
        ticketTypeId: dto.ticketTypeId,
        quantity: dto.quantity,
        basePrice,
        discountAmount,
        pointsUsed: dto.pointsUsed,
        finalPrice,
        paymentStatus: 'PENDING',
      },
    });

    // 7. Catat penggunaan poin
    if (dto.pointsUsed > 0) {
      await tx.point.create({
        data: {
          userId: dto.userId,
          amount: -dto.pointsUsed,
          type: 'USED',
          description: `Digunakan untuk transaksi ${transaction.id}`,
          expiredAt: new Date(), // Poin USED tidak expire
        },
      });
    }

    // 8. Kurangi kursi yang tersedia
    await tx.event.update({
      where: { id: dto.eventId },
      data: { availableSeats: { decrement: dto.quantity } },
    });

    return transaction;
  });
};
```

---

## 8.4 Backend: Event Controller (`src/controllers/event.controller.ts`)

```typescript
import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service';

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, category, location, page = '1', limit = '10' } = req.query;
    const result = await eventService.getPublishedEvents({
      search: search as string,
      category: category as string,
      location: location as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.getEventDetail(req.params.id);
    if (!event) {
      res.status(404).json({ success: false, message: 'Event tidak ditemukan' });
      return;
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await eventService.createEvent({
      ...req.body,
      organizerId: req.user!.id,
    });
    res.status(201).json({ success: true, message: 'Event berhasil dibuat', data: event });
  } catch (error) {
    next(error);
  }
};
```

---

## 8.5 Frontend: Axios API Setup (`src/services/api.ts`)

```typescript
import axios from 'axios';
import { getToken, clearAuthStorage } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — tambahkan JWT token otomatis
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthStorage();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 8.6 Frontend: useDebounce Hook (`src/hooks/useDebounce.ts`)

```typescript
import { useState, useEffect } from 'react';

/**
 * Custom hook untuk menunda eksekusi sampai pengguna berhenti mengetik
 * @param value - Nilai yang ingin di-debounce
 * @param delay - Waktu tunda dalam ms (default: 500ms)
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: batalkan timer jika value berubah sebelum delay selesai
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

---

## 8.7 Frontend: Protected Route (`src/router/ProtectedRoute.tsx`)

```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <Spinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

---

## 8.8 Frontend: Event List Page dengan Debounce (`src/pages/LandingPage.tsx`)

```typescript
import { useState, useEffect } from 'react';
import { getEvents } from '../services/event.service';
import useDebounce from '../hooks/useDebounce';
import EventCard from '../components/events/EventCard';
import SearchBar from '../components/events/SearchBar';
import EventFilters from '../components/events/EventFilters';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { Event } from '../types/event.types';

const LandingPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce: tunda API call 500ms setelah user berhenti mengetik
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await getEvents({
          search: debouncedSearch,
          category,
          location,
          page,
          limit: 10,
        });
        setEvents(res.data.events);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedSearch, category, location, page]);

  // Reset ke halaman 1 ketika filter berubah
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, location]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Temukan Event Terbaik</h1>
          <p className="text-lg mb-8 text-blue-100">
            Ribuan event menarik menunggumu — musik, teknologi, bisnis, dan banyak lagi
          </p>
          <SearchBar value={searchInput} onChange={setSearchInput} />
        </div>
      </section>

      {/* Filter & Content */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filter */}
          <aside className="w-full md:w-64 shrink-0">
            <EventFilters
              selectedCategory={category}
              selectedLocation={location}
              onCategoryChange={setCategory}
              onLocationChange={setLocation}
            />
          </aside>

          {/* Event Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner />
              </div>
            ) : events.length === 0 ? (
              <EmptyState
                title="Event tidak ditemukan"
                description="Coba ubah kata kunci pencarian atau filter Anda"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
                <div className="mt-8">
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
    </div>
  );
};

export default LandingPage;
```

---

## 8.9 Frontend: AuthContext (`src/context/AuthContext.tsx`)

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe } from '../services/auth.service';
import { getToken, clearAuthStorage, saveAuthData } from '../utils/storage';
import { User } from '../types/user.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (!token) { setIsLoading(false); return; }
      try {
        const res = await getMe();
        setUser(res.data);
      } catch {
        clearAuthStorage();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    saveAuthData(token, userData);
    setUser(userData);
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus digunakan dalam AuthProvider');
  return ctx;
};
```

---

# 9. FLOWCHARTS

## 9.1 Flowchart: Registrasi Pengguna

```
MULAI
   │
   ▼
User mengisi form registrasi
(nama, email, password, role)
   │
   ▼
Apakah mengisi referral code?
   │
   ├─ YA ──► Cari user pemilik kode referral
   │              │
   │              ├─ Tidak ditemukan? ──► Tampilkan error
   │              │
   │              └─ Ditemukan:
   │                   • Buat kupon diskon 10% untuk pendaftar baru
   │                   • Tambah 10.000 poin ke pemilik referral (expired 3 bulan)
   │
   └─ TIDAK ──► Lanjut
   │
   ▼
Validasi email unik
   │
   ├─ Email sudah ada? ──► Tampilkan error "Email sudah terdaftar"
   │
   └─ Email baru:
       │
       ▼
   Hash password dengan bcrypt
       │
       ▼
   Generate referral code unik untuk pendaftar baru
       │
       ▼
   Simpan user ke database
       │
       ▼
   Generate JWT token
       │
       ▼
   Kembalikan response (token + data user)
       │
       ▼
SELESAI
```

---

## 9.2 Flowchart: Pembuatan Event

```
MULAI
   │
   ▼
Organizer login (JWT valid)
   │
   ▼
Organizer mengisi form event
(judul, deskripsi, lokasi, harga,
 tanggal, kursi, tipe tiket)
   │
   ▼
Validasi input server-side
   │
   ├─ Gagal? ──► Tampilkan pesan error validasi
   │
   └─ Berhasil:
       │
       ▼
   Simpan event dengan status DRAFT
       │
       ▼
   Apakah ada tipe tiket? (opsional)
       │
       ├─ YA ──► Simpan tipe tiket terkait event
       │
       └─ TIDAK ──► Lanjut
       │
       ▼
   Apakah event dipublikasikan sekarang?
       │
       ├─ YA ──► Update status → PUBLISHED
       │
       └─ TIDAK ──► Tetap DRAFT
       │
       ▼
   Tampilkan konfirmasi event berhasil dibuat
       │
       ▼
SELESAI
```

---

## 9.3 Flowchart: Pembelian Tiket

```
MULAI
   │
   ▼
User (Customer) memilih event
   │
   ▼
Klik "Beli Tiket"
   │
   ▼
Apakah sudah login?
   │
   ├─ TIDAK ──► Redirect ke halaman login
   │
   └─ YA:
       │
       ▼
   Pilih jumlah & tipe tiket
       │
       ▼
   Apakah punya kupon?
       │
       ├─ YA ──► Input kode kupon
       │             │
       │             ├─ Tidak valid/expired? → Tampilkan error
       │             └─ Valid → Terapkan diskon %
       │
       └─ TIDAK ──► Lanjut
       │
       ▼
   Apakah ingin pakai poin?
       │
       ├─ YA ──► Input jumlah poin (max: poin aktif)
       │             │
       │             └─ Kurangi dari harga
       │
       └─ TIDAK ──► Lanjut
       │
       ▼
   Tampilkan ringkasan: harga dasar,
   diskon, poin, harga final
       │
       ▼
   User konfirmasi pembayaran
   (popup konfirmasi dialog)
       │
       ▼
   API: POST /transactions
       │
       ▼
   Backend (dalam 1 SQL Transaction):
   • Validasi kursi tersisa
   • Validasi kupon & poin
   • Hitung harga final
   • Buat record transaksi (PENDING)
   • Catat penggunaan poin
   • Kurangi available_seats
   • Update status kupon → is_used: true
       │
       ▼
   Simulasi pembayaran (PATCH /pay)
   → Status: PAID
       │
       ▼
   Tampilkan halaman konfirmasi sukses
       │
       ▼
SELESAI
```

---

## 9.4 Flowchart: Sistem Referral

```
MULAI
   │
   ▼
User baru mendaftar dengan referral code
"REF-ABC123"
   │
   ▼
Sistem mencari pemilik kode referral
   │
   ├─ Tidak ditemukan ──► Lanjut tanpa manfaat referral
   │
   └─ Ditemukan (misal: User A):
       │
       ▼
   Sistem menambahkan 10.000 poin ke User A
   (expired_at = NOW() + 3 bulan)
       │
       ▼
   Sistem membuat kupon diskon 10%
   untuk user baru yang mendaftar
   (expired_at = NOW() + 3 bulan)
       │
       ▼
   Simpan catatan poin User A
   Simpan kupon user baru
       │
       ▼
   Jika User A punya 3 referral:
   Total poin = 3 × 10.000 = 30.000 poin
       │
       ▼
SELESAI
```

---

## 9.5 Flowchart: Sistem Ulasan & Rating

```
MULAI
   │
   ▼
User mengakses halaman "Tiket Saya"
   │
   ▼
Sistem menampilkan daftar tiket
yang telah dibeli (status: PAID)
   │
   ▼
Untuk setiap event yang sudah selesai
(end_date < NOW()):
   │
   ├─ Sudah diulas? ──► Tampilkan ulasan yang ada
   │
   └─ Belum diulas:
       │
       ▼
   Tampilkan tombol "Tulis Ulasan"
       │
       ▼
   User mengisi rating (1–5 bintang)
   dan komentar (opsional)
       │
       ▼
   Klik "Kirim Ulasan"
       │
       ▼
   Backend validasi:
   • Apakah user punya transaksi PAID untuk event ini?
   • Apakah event sudah selesai?
   • Apakah user belum pernah mengulas event ini?
       │
       ├─ Validasi gagal ──► Tampilkan pesan error
       │
       └─ Berhasil ──► Simpan ulasan ke database
           │
           ▼
       Update rata-rata rating event
           │
           ▼
       Tampilkan konfirmasi ulasan terkirim
           │
           ▼
SELESAI
```

---

# 10. DEVELOPER TASK DIVISION

## 10.1 Developer 1 — Feature 1: Event Discovery & Event Management

### Tanggung Jawab Utama
Developer 1 bertanggung jawab penuh atas fitur pencarian dan browsing event, fitur pembuatan dan manajemen event oleh organizer, sistem promosi event, serta fitur ulasan dan rating.

---

### Backend APIs yang Diimplementasikan

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| GET | `/api/v1/events` | Daftar event dengan search, filter, pagination |
| GET | `/api/v1/events/:id` | Detail event tunggal |
| POST | `/api/v1/events` | Buat event baru |
| PUT | `/api/v1/events/:id` | Update event |
| DELETE | `/api/v1/events/:id` | Hapus event |
| POST | `/api/v1/events/:id/publish` | Publikasikan event |
| GET | `/api/v1/categories` | Daftar kategori |
| POST | `/api/v1/events/:id/promotions` | Tambah promosi |
| GET | `/api/v1/events/:id/promotions` | Daftar promosi event |
| POST | `/api/v1/reviews` | Buat ulasan |
| GET | `/api/v1/reviews/event/:id` | Daftar ulasan event |

---

### Database Models yang Dikelola

- `events`
- `categories`
- `ticket_types`
- `promotions`
- `reviews`

---

### Frontend Pages yang Dikembangkan

| File | Keterangan |
|------|------------|
| `pages/LandingPage.tsx` | Halaman utama event discovery |
| `pages/EventDetailPage.tsx` | Detail event, tiket, ulasan |
| `pages/CreateEventPage.tsx` | Form pembuatan event |
| `pages/EditEventPage.tsx` | Form edit event |
| `pages/DashboardPage.tsx` | Dashboard statistik organizer |
| `pages/DashboardAttendeesPage.tsx` | Daftar peserta event |

---

### Komponen Frontend yang Dibuat

| File | Keterangan |
|------|------------|
| `components/events/EventCard.tsx` | Kartu event di listing |
| `components/events/EventFilters.tsx` | Komponen filter kategori & lokasi |
| `components/events/SearchBar.tsx` | Search bar dengan useDebounce |
| `components/events/EventTicketSelector.tsx` | Pemilih tipe tiket |
| `components/events/ReviewCard.tsx` | Kartu ulasan pengguna |
| `components/dashboard/StatsCard.tsx` | Kartu ringkasan statistik |
| `components/dashboard/RevenueChart.tsx` | Grafik pendapatan (Recharts) |
| `components/dashboard/AttendeeTable.tsx` | Tabel daftar peserta |

---

### File Backend yang Dibuat

```
src/controllers/event.controller.ts
src/controllers/review.controller.ts
src/services/event.service.ts
src/services/review.service.ts
src/repositories/event.repository.ts
src/repositories/review.repository.ts
src/routes/event.routes.ts
src/routes/review.routes.ts
```

---

## 10.2 Developer 2 — Feature 2: User System & Referral System

### Tanggung Jawab Utama
Developer 2 bertanggung jawab penuh atas sistem autentikasi, manajemen peran pengguna, sistem referral dan poin, sistem kupon diskon, serta proses transaksi pembelian tiket.

---

### Backend APIs yang Diimplementasikan

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/v1/auth/register` | Registrasi pengguna baru |
| POST | `/api/v1/auth/login` | Login dan mendapat JWT |
| GET | `/api/v1/auth/me` | Data profil pengguna aktif |
| GET | `/api/v1/points/my` | Saldo poin aktif pengguna |
| GET | `/api/v1/coupons/my` | Daftar kupon pengguna |
| POST | `/api/v1/transactions` | Buat transaksi pembelian tiket |
| GET | `/api/v1/transactions/my` | Riwayat transaksi pengguna |
| PATCH | `/api/v1/transactions/:id/pay` | Konfirmasi pembayaran |
| GET | `/api/v1/dashboard/stats` | Statistik organizer |
| GET | `/api/v1/dashboard/events` | Event milik organizer |
| GET | `/api/v1/dashboard/attendees/:eventId` | Peserta event |

---

### Database Models yang Dikelola

- `users`
- `points`
- `coupons`
- `transactions`

---

### Frontend Pages yang Dikembangkan

| File | Keterangan |
|------|------------|
| `pages/LoginPage.tsx` | Halaman login |
| `pages/RegisterPage.tsx` | Halaman registrasi |
| `pages/ProfilePage.tsx` | Halaman profil pengguna |
| `pages/MyTicketsPage.tsx` | Riwayat tiket customer |
| `pages/CheckoutPage.tsx` | Halaman checkout tiket |
| `pages/TransactionSuccessPage.tsx` | Konfirmasi sukses transaksi |

---

### Komponen & File Shared yang Dibuat

| File | Keterangan |
|------|------------|
| `context/AuthContext.tsx` | Context autentikasi global |
| `router/index.tsx` | Konfigurasi semua routing |
| `router/ProtectedRoute.tsx` | Guard route berdasarkan role |
| `hooks/useAuth.ts` | Hook akses AuthContext |
| `services/api.ts` | Instance Axios global |
| `utils/storage.ts` | Helper localStorage |

---

### File Backend yang Dibuat

```
src/controllers/auth.controller.ts
src/controllers/transaction.controller.ts
src/controllers/point.controller.ts
src/controllers/coupon.controller.ts
src/controllers/dashboard.controller.ts
src/services/auth.service.ts
src/services/transaction.service.ts
src/services/point.service.ts
src/services/referral.service.ts
src/services/dashboard.service.ts
src/repositories/user.repository.ts
src/repositories/transaction.repository.ts
src/repositories/point.repository.ts
src/repositories/coupon.repository.ts
src/routes/auth.routes.ts
src/routes/transaction.routes.ts
src/routes/point.routes.ts
src/routes/coupon.routes.ts
src/routes/dashboard.routes.ts
src/middlewares/auth.middleware.ts
src/middlewares/role.middleware.ts
src/middlewares/error.middleware.ts
src/utils/jwt.ts
src/utils/bcrypt.ts
src/utils/referralCode.ts
src/utils/couponCode.ts
```

---

## 10.3 File Shared (Dikerjakan Bersama)

| File | Keterangan |
|------|------------|
| `prisma/schema.prisma` | Schema database (diselesaikan bersama) |
| `prisma/seed.ts` | Script seeder data awal |
| `src/app.ts` | Setup Express utama |
| `src/config/database.ts` | Inisialisasi Prisma Client |
| `components/common/` | Semua komponen UI dasar |
| `components/layout/` | Navbar, Footer, Layout |

---

# 11. TESTING STRATEGY

## 11.1 Unit Testing

### Tools yang Digunakan

| Tool | Fungsi |
|------|--------|
| **Jest** | Framework testing utama untuk Node.js TypeScript |
| **Supertest** | Testing HTTP endpoint Express |
| **@testing-library/react** | Testing komponen React |
| **@testing-library/jest-dom** | Matcher tambahan untuk DOM testing |
| **Vitest** | Alternatif Jest untuk Vite (frontend) |

---

### Skenario Test Backend

#### Auth Service Tests
```typescript
// src/services/__tests__/auth.service.test.ts
describe('AuthService', () => {
  it('harus berhasil registrasi dengan data valid', async () => { ... });
  it('harus menolak jika email sudah terdaftar', async () => { ... });
  it('harus menolak jika referral code tidak valid', async () => { ... });
  it('harus generate referral code unik saat registrasi', async () => { ... });
  it('harus berhasil login dengan kredensial benar', async () => { ... });
  it('harus menolak login dengan password salah', async () => { ... });
});
```

#### Transaction Service Tests
```typescript
describe('TransactionService', () => {
  it('harus membuat transaksi dengan harga yang benar', async () => { ... });
  it('harus menerapkan diskon kupon dengan benar', async () => { ... });
  it('harus menolak kupon yang sudah digunakan', async () => { ... });
  it('harus mengurangi available seats setelah transaksi', async () => { ... });
  it('harus menolak jika poin melebihi saldo aktif', async () => { ... });
  it('harus rollback jika terjadi error di tengah SQL transaction', async () => { ... });
});
```

#### Event Service Tests
```typescript
describe('EventService', () => {
  it('harus mengembalikan hanya event PUBLISHED untuk publik', async () => { ... });
  it('harus memfilter event berdasarkan kategori', async () => { ... });
  it('harus mengembalikan hasil pagination yang benar', async () => { ... });
  it('hanya organizer yang bisa membuat event', async () => { ... });
});
```

---

### Skenario Test Frontend

#### LoginPage Tests
```typescript
// src/pages/__tests__/LoginPage.test.tsx
describe('LoginPage', () => {
  it('harus merender form login', () => { ... });
  it('harus menampilkan error jika field kosong', () => { ... });
  it('harus redirect ke dashboard setelah login berhasil', async () => { ... });
});
```

#### useDebounce Hook Tests
```typescript
describe('useDebounce', () => {
  it('harus mengembalikan nilai awal sebelum delay selesai', () => { ... });
  it('harus memperbarui nilai setelah delay', async () => { ... });
  it('harus membatalkan update jika nilai berubah sebelum delay', async () => { ... });
});
```

---

## 11.2 Integration Testing

Pengujian API secara end-to-end menggunakan Supertest:

```typescript
// src/__tests__/integration/auth.integration.test.ts
describe('POST /api/v1/auth/register', () => {
  it('should return 201 with user data on success', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test User', email: 'test@email.com', password: 'password123', role: 'CUSTOMER' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('referralCode');
  });

  it('should return 409 if email already exists', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Test User', email: 'duplicate@email.com', password: 'pass', role: 'CUSTOMER' });
    expect(res.status).toBe(409);
  });
});
```

---

## 11.3 Cara Menjalankan Test

```bash
# Backend — jalankan semua unit test
cd backend
npm run test

# Backend — dengan coverage report
npm run test:coverage

# Frontend — jalankan semua test
cd frontend
npm run test

# Frontend — dengan UI mode (Vitest)
npm run test:ui
```

---

## 11.4 Database Testing Strategy

- Gunakan database PostgreSQL **terpisah** untuk environment testing
- Set variabel `DATABASE_URL_TEST` di `.env.test`
- Gunakan `prisma migrate reset` sebelum setiap test run untuk memastikan state bersih
- Gunakan `prisma/seed.ts` untuk mengisi data awal yang konsisten

---

# 12. FUTURE IMPROVEMENTS

## 12.1 Peningkatan Teknis

| No | Peningkatan | Deskripsi |
|----|-------------|-----------|
| 1 | **Payment Gateway Real** | Integrasi dengan Midtrans atau Xendit untuk pembayaran nyata (transfer bank, QRIS, kartu kredit) |
| 2 | **Email Notifications** | Integrasi NodeMailer/SendGrid untuk kirim tiket dan konfirmasi via email otomatis |
| 3 | **Redis Caching** | Cache hasil query event populer di Redis untuk mengurangi beban database |
| 4 | **File Upload** | Integrasi Supabase Storage untuk upload gambar event dari organizer |
| 5 | **WebSocket** | Notifikasi real-time untuk update stok tiket dan konfirmasi pembayaran |
| 6 | **Rate Limiting** | Tambahkan rate limiter (`express-rate-limit`) untuk melindungi API dari abuse |
| 7 | **API Versioning** | Kelola versi API (`/v1`, `/v2`) dengan lebih terstruktur |
| 8 | **Docker** | Containerisasi aplikasi dengan Docker dan Docker Compose untuk deployment konsisten |

---

## 12.2 Peningkatan Fitur

| No | Peningkatan | Deskripsi |
|----|-------------|-----------|
| 1 | **Mobile App** | Kembangkan aplikasi mobile React Native menggunakan backend API yang sama |
| 2 | **Multi-Bahasa** | Tambahkan dukungan i18n (Bahasa Indonesia dan Bahasa Inggris) |
| 3 | **Pencarian Lokasi** | Integrasi Google Maps API untuk filter event berdasarkan radius lokasi |
| 4 | **QR Code Tiket** | Generate QR code untuk tiket digital yang bisa di-scan saat pintu masuk |
| 5 | **Admin Panel** | Dashboard admin platform untuk moderasi event dan manajemen user |
| 6 | **Gamifikasi** | Badge dan pencapaian untuk pengguna aktif (top reviewer, referral champion) |
| 7 | **Rekomendasi Event** | Algoritma rekomendasi event berdasarkan history pembelian dan preferensi |
| 8 | **Fitur Waitlist** | Daftar antrian untuk event yang sudah habis tiket |

---

## 12.3 Peningkatan Infrastruktur

| No | Peningkatan | Deskripsi |
|----|-------------|-----------|
| 1 | **CI/CD Pipeline** | Otomasi deployment menggunakan GitHub Actions ke Vercel (frontend) dan Railway (backend) |
| 2 | **Monitoring** | Integrasi Sentry untuk error tracking dan monitoring performa production |
| 3 | **Load Balancing** | Implementasi horizontal scaling dengan multiple instance backend |
| 4 | **CDN** | Distribusi aset statis via CDN (Cloudflare) untuk performa global |
| 5 | **Database Replika** | Tambahkan read replica PostgreSQL untuk distribusi beban query |

---

## 12.4 Peningkatan Keamanan

| No | Peningkatan | Deskripsi |
|----|-------------|-----------|
| 1 | **OAuth2** | Dukung login dengan Google/GitHub menggunakan Passport.js |
| 2 | **2FA** | Implementasi Two-Factor Authentication menggunakan TOTP |
| 3 | **Audit Log** | Catat semua aksi penting (buat event, transaksi) untuk audit trail |
| 4 | **HTTPS Enforcing** | Wajibkan HTTPS di semua environment production |
| 5 | **Token Refresh** | Implementasi refresh token untuk pengalaman login yang lebih mulus |

---

*— End of Software Design Document Part 2 —*

**Dokumen ini ditulis dalam Bahasa Indonesia sebagai dokumen teknis resmi untuk proyek Event Management Platform MVP.**
**Versi:** 1.0.0 | **Tanggal:** 17 Maret 2026
