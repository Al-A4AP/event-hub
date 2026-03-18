# SOFTWARE DESIGN DOCUMENT (SDD)
## Event Management Platform — MVP
**Versi:** 1.0.0
**Tanggal:** 17 Maret 2026
**Status:** Draft
**Bahasa:** Bahasa Indonesia

---

# DAFTAR ISI

1. Project Overview
2. System Architecture
3. Technology Stack
4. Database Design (ERD)
5. API Design
6. Backend Folder Structure *(Lihat Part 2)*
7. Frontend Folder Structure *(Lihat Part 2)*
8. Core Code Examples *(Lihat Part 2)*
9. Flowcharts *(Lihat Part 2)*
10. Developer Task Division *(Lihat Part 2)*
11. Testing Strategy *(Lihat Part 2)*
12. Future Improvements *(Lihat Part 2)*

---

# 1. PROJECT OVERVIEW

## 1.1 Deskripsi Platform

**Event Management Platform** adalah sebuah aplikasi web fullstack berbasis MVP (*Minimum Viable Product*) yang dirancang untuk memfasilitasi dua kelompok pengguna utama:

- **Event Organizer (EO):** Pengguna yang berperan sebagai penyelenggara acara. Mereka dapat membuat, mengelola, dan mempromosikan event kepada publik.
- **Customer / Peserta:** Pengguna umum yang dapat menjelajahi daftar event, melihat detail event, membeli tiket, dan memberikan ulasan setelah menghadiri event.

Platform ini terinspirasi dari layanan seperti [Eventbrite](https://www.eventbrite.com/) dan bertujuan untuk memberikan pengalaman yang sederhana namun lengkap dalam manajemen event berbasis digital.

## 1.2 Tujuan Utama

| No | Tujuan |
|----|--------|
| 1  | Menyediakan sarana bagi Event Organizer untuk membuat dan mempublikasikan event |
| 2  | Menyediakan halaman penemuan event (*event discovery*) bagi peserta |
| 3  | Mengimplementasikan sistem pembelian tiket online dengan dukungan mata uang IDR |
| 4  | Mengimplementasikan sistem autentikasi berbasis JWT dengan peran pengguna |
| 5  | Mengimplementasikan sistem referral dan poin reward |
| 6  | Menyediakan dashboard organizer dengan statistik dan visualisasi grafik |
| 7  | Mendukung sistem ulasan dan rating setelah event berlangsung |

## 1.3 Ruang Lingkup MVP

Fitur yang termasuk dalam MVP:

- Autentikasi (Register, Login, JWT)
- Manajemen Event (CRUD oleh Organizer)
- Penemuan Event (Browse, Search, Filter, Pagination)
- Pembelian Tiket (untuk event berbayar maupun gratis)
- Sistem Referral dan Poin
- Dashboard Organizer dengan statistik
- Ulasan & Rating Event
- Sistem Promosi (voucher diskon, diskon berdasarkan tanggal)

Fitur yang **tidak termasuk** dalam MVP (untuk iterasi berikutnya):
- Payment gateway real (hanya simulasi)
- Notifikasi email otomatis
- Mobile application (iOS/Android)
- Multi-bahasa (i18n)

## 1.4 Target Pengguna

| Tipe Pengguna | Deskripsi |
|---------------|-----------|
| Customer | Pengguna yang ingin mencari dan membeli tiket event |
| Organizer | Pengguna yang mengelola dan membuat event |
| Admin (future) | Pengelola platform secara keseluruhan |

---

# 2. SYSTEM ARCHITECTURE

## 2.1 Gambaran Umum Arsitektur

Platform ini menggunakan arsitektur **Client-Server** dengan pemisahan yang jelas antara *frontend* dan *backend*. Komunikasi antar layer dilakukan melalui **RESTful API** menggunakan protokol HTTP/HTTPS.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │              React + Vite + TypeScript                   │  │
│   │         (TailwindCSS v4, Axios, React Router)            │  │
│   └──────────────────────┬───────────────────────────────────┘  │
└──────────────────────────│──────────────────────────────────────┘
                           │ HTTP/HTTPS REST API
                           │ (JSON)
┌──────────────────────────▼──────────────────────────────────────┐
│                       SERVER LAYER                              │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │          Node.js + Express.js + TypeScript               │  │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│   │   │ Routes   │→ │Controllers│→ │ Services │              │  │
│   │   └──────────┘  └──────────┘  └──────────┘              │  │
│   │                               ┌──────────┐              │  │
│   │                               │Repositories│             │  │
│   │                               └─────┬────┘              │  │
│   │                        ┌────────────▼──────────────┐    │  │
│   │                        │      Prisma ORM            │    │  │
│   │                        └────────────┬──────────────┘    │  │
│   └─────────────────────────────────────│──────────────────┘  │
└─────────────────────────────────────────│──────────────────────┘
                                          │ SQL Queries
┌─────────────────────────────────────────▼──────────────────────┐
│                      DATABASE LAYER                            │
│              PostgreSQL (Hosted on Supabase)                   │
└────────────────────────────────────────────────────────────────┘
```

## 2.2 Pola Arsitektur Backend

Backend menggunakan pola **Layered Architecture**:

| Layer | Tanggung Jawab |
|-------|----------------|
| **Routes** | Mendefinisikan endpoint HTTP dan menetapkan middleware |
| **Controllers** | Menerima request, memanggil service, mengirim response |
| **Services** | Berisi business logic utama aplikasi |
| **Repositories** | Berinteraksi langsung dengan database melalui Prisma |
| **Middlewares** | Autentikasi, otorisasi, validasi request, error handling |

## 2.3 Diagram Interaksi Frontend–Backend

```
Browser (User)
     │
     │  1. User mengakses halaman
     ▼
React App (Vite)
     │
     │  2. React memanggil API melalui Axios
     │     Header: Authorization: Bearer <JWT_TOKEN>
     ▼
Express.js Router
     │
     │  3. Middleware: verifikasi JWT
     │     Middleware: validasi role
     ▼
Controller
     │
     │  4. Parsing request body/params/query
     │     Memanggil Service
     ▼
Service Layer
     │
     │  5. Business logic (kalkulasi harga, poin, dsb.)
     │     Memanggil Repository
     ▼
Repository Layer
     │
     │  6. Query ke database menggunakan Prisma ORM
     ▼
PostgreSQL (Supabase)
     │
     │  7. Hasil query dikembalikan
     ▼
Service → Controller
     │
     │  8. Format response JSON
     ▼
React App
     │
     │  9. Update state, render UI
     ▼
Browser (User) — Menampilkan data
```

## 2.4 Keamanan Sistem

- **JWT Authentication** — setiap request ke endpoint protected wajib menyertakan token
- **Role Guard Middleware** — memisahkan akses antara Customer dan Organizer
- **Input Validation** — validasi request body di level controller/middleware
- **Environment Variables** — semua konfigurasi sensitif (DB URL, JWT secret) disimpan di `.env`
- **SQL Transactions** — operasi multi-tabel menggunakan Prisma `$transaction()`
- **CORS Policy** — konfigurasi CORS di Express untuk membatasi origin yang diizinkan

---

# 3. TECHNOLOGY STACK

## 3.1 Backend

### Node.js
**Versi:** LTS (v20+)
**Alasan Penggunaan:**
- Runtime JavaScript di sisi server yang cepat dan ringan berbasis event-driven, non-blocking I/O
- Ekosistem npm yang sangat besar memudahkan penggunaan library pihak ketiga
- Ideal untuk membangun RESTful API yang scalable

### Express.js
**Alasan Penggunaan:**
- Framework minimalis yang fleksibel untuk membangun REST API
- Mendukung middleware-based pipeline yang memudahkan penambahan fitur seperti autentikasi, logging, dan validasi
- Komunitas besar dan dokumentasi lengkap
- Mudah diintegrasikan dengan TypeScript

### TypeScript
**Alasan Penggunaan:**
- Superset JavaScript yang menyediakan *static typing*
- Mengurangi bug di runtime dengan deteksi kesalahan tipe saat compile time
- Meningkatkan *developer experience* dengan autocomplete dan IntelliSense
- Standar industri untuk project production-level

### Prisma ORM
**Alasan Penggunaan:**
- ORM modern dengan dukungan TypeScript penuh, termasuk *type-safe queries*
- Schema declarative (`schema.prisma`) memudahkan pengelolaan migrasi database
- Mendukung PostgreSQL secara native
- Prisma Studio sebagai alat visual untuk inspeksi data

### PostgreSQL (via Supabase)
**Alasan Penggunaan:**
- Database relasional yang robust, mendukung ACID transactions
- Ideal untuk relasi data kompleks (users, events, transactions, reviews)
- Supabase menyediakan managed PostgreSQL cloud gratis dengan dashboard yang mudah digunakan
- Mendukung Row Level Security (RLS) untuk keamanan data

## 3.2 Frontend

### React
**Versi:** 18+
**Alasan Penggunaan:**
- Library UI berbasis komponen yang sangat populer
- Virtual DOM untuk rendering performa tinggi
- Ekosistem besar (React Router, React Query, dsb.)
- Kompatibel dengan Vite untuk development experience yang cepat

### Vite
**Alasan Penggunaan:**
- Build tool generasi terbaru dengan *hot module replacement* (HMR) yang sangat cepat
- Menggantikan Create React App (CRA) yang sudah tidak direkomendasikan
- Konfigurasi minimal dengan dukungan TypeScript dan TSX bawaan

### TailwindCSS v4
**Alasan Penggunaan:**
- CSS utility-first yang memungkinkan styling langsung di JSX/TSX tanpa file CSS terpisah
- Versi 4 menghadirkan performa build lebih cepat dan konfigurasi berbasis CSS variables
- Responsive design sangat mudah dengan prefix seperti `md:`, `lg:`
- Ukuran bundle CSS final sangat kecil karena purge otomatis

### Axios
**Alasan Penggunaan:**
- HTTP client berbasis Promise untuk melakukan API request dari frontend
- Mendukung interceptors untuk menambahkan Authorization header secara otomatis
- Penanganan error yang lebih baik dibanding Fetch API native
- Mendukung request/response transformation

---

# 4. DATABASE DESIGN

## 4.1 Entity Relationship Diagram (ERD)

```
┌─────────────┐        ┌─────────────────┐        ┌──────────────┐
│    users    │        │     events      │        │  categories  │
├─────────────┤        ├─────────────────┤        ├──────────────┤
│ id (PK)     │1      N│ id (PK)         │N      1│ id (PK)      │
│ name        │────────│ organizer_id(FK)│────────│ name         │
│ email       │        │ category_id(FK) │        │ created_at   │
│ password    │        │ title           │        └──────────────┘
│ role        │        │ description     │
│ referral_   │        │ location        │
│  code       │        │ price           │
│ referred_by │        │ is_free         │
│ avatar_url  │        │ start_date      │
│ created_at  │        │ end_date        │
│ updated_at  │        │ available_seats │
└──────┬──────┘        │ image_url       │
       │               │ status          │
       │               │ created_at      │
       │               │ updated_at      │
    1  │               └────────┬────────┘
       │                        │ 1
       │N               ┌───────┴──────────┐N       1┌──────────────┐
       │                │  ticket_types    │─────────│   events     │
       │                ├──────────────────┤         └──────────────┘
       │                │ id (PK)          │
       │                │ event_id (FK)    │
       │                │ name             │
       │                │ price            │
       │                │ quota            │
       │                │ created_at       │
       │                └──────────────────┘
       │
       │ 1
       │
       │N ┌──────────────────────┐
       └──│     transactions     │
          ├──────────────────────┤
          │ id (PK)              │
          │ user_id (FK)         │
          │ event_id (FK)        │
          │ ticket_type_id (FK)  │
          │ coupon_id (FK)       │
          │ quantity             │
          │ base_price           │
          │ discount_amount      │
          │ points_used          │
          │ final_price          │
          │ payment_status       │
          │ created_at           │
          └──────────┬───────────┘
                     │ 1
                     │
          ┌──────────▼───────────┐
          │       reviews        │
          ├──────────────────────┤
          │ id (PK)              │
          │ user_id (FK)         │
          │ event_id (FK)        │
          │ transaction_id (FK)  │
          │ rating (1–5)         │
          │ comment              │
          │ created_at           │
          └──────────────────────┘

┌─────────────────────┐        ┌──────────────────────┐
│       points        │        │       coupons        │
├─────────────────────┤        ├──────────────────────┤
│ id (PK)             │        │ id (PK)              │
│ user_id (FK)        │        │ user_id (FK)         │
│ amount              │        │ code                 │
│ type (EARNED/USED)  │        │ discount_percent     │
│ description         │        │ is_used              │
│ expired_at          │        │ expired_at           │
│ created_at          │        │ created_at           │
└─────────────────────┘        └──────────────────────┘

┌─────────────────────┐
│      promotions     │
├─────────────────────┤
│ id (PK)             │
│ event_id (FK)       │
│ type (REFERRAL/DATE)│
│ discount_percent    │
│ discount_amount     │
│ code (nullable)     │
│ start_date          │
│ end_date            │
│ created_at          │
└─────────────────────┘
```

## 4.2 Definisi Tabel

### Tabel: `users`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Primary key |
| name | VARCHAR(100) | NOT NULL | Nama lengkap pengguna |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Alamat email unik |
| password | TEXT | NOT NULL | Password terenkripsi (bcrypt) |
| role | ENUM | NOT NULL, DEFAULT 'CUSTOMER' | CUSTOMER / ORGANIZER |
| referral_code | VARCHAR(20) | NOT NULL, UNIQUE | Kode referral unik yang dibuat otomatis |
| referred_by | VARCHAR(20) | NULLABLE | Kode referral yang digunakan saat registrasi |
| avatar_url | TEXT | NULLABLE | URL foto profil |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu terakhir diperbarui |

### Tabel: `categories`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK | Primary key |
| name | VARCHAR(50) | NOT NULL, UNIQUE | Nama kategori (Musik, Teknologi, dsb.) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu dibuat |

### Tabel: `events`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK | Primary key |
| organizer_id | UUID | FK → users.id, NOT NULL | ID penyelenggara |
| category_id | UUID | FK → categories.id, NOT NULL | Kategori event |
| title | VARCHAR(200) | NOT NULL | Nama/judul event |
| description | TEXT | NOT NULL | Deskripsi lengkap event |
| location | VARCHAR(255) | NOT NULL | Lokasi event |
| price | BIGINT | NOT NULL, DEFAULT 0 | Harga dasar dalam IDR (0 = gratis) |
| is_free | BOOLEAN | NOT NULL, DEFAULT false | Flag event gratis |
| start_date | TIMESTAMP | NOT NULL | Tanggal & jam mulai event |
| end_date | TIMESTAMP | NOT NULL | Tanggal & jam selesai event |
| available_seats | INTEGER | NOT NULL | Jumlah kursi/tiket tersedia |
| image_url | TEXT | NULLABLE | URL banner/gambar event |
| status | ENUM | NOT NULL, DEFAULT 'DRAFT' | DRAFT / PUBLISHED / CANCELLED / COMPLETED |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu terakhir diperbarui |

### Tabel: `ticket_types`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK | Primary key |
| event_id | UUID | FK → events.id, NOT NULL | Event yang terkait |
| name | VARCHAR(100) | NOT NULL | Nama tipe tiket (VIP, Regular, dsb.) |
| price | BIGINT | NOT NULL | Harga tipe tiket dalam IDR |
| quota | INTEGER | NOT NULL | Kuota tiket untuk tipe ini |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu dibuat |

### Tabel: `transactions`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → users.id, NOT NULL | Pembeli tiket |
| event_id | UUID | FK → events.id, NOT NULL | Event yang dibeli |
| ticket_type_id | UUID | FK → ticket_types.id, NULLABLE | Tipe tiket (jika ada) |
| coupon_id | UUID | FK → coupons.id, NULLABLE | Kupon diskon yang dipakai |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | Jumlah tiket yang dibeli |
| base_price | BIGINT | NOT NULL | Harga sebelum diskon |
| discount_amount | BIGINT | NOT NULL, DEFAULT 0 | Total diskon dalam IDR |
| points_used | BIGINT | NOT NULL, DEFAULT 0 | Poin yang digunakan |
| final_price | BIGINT | NOT NULL | Harga final setelah diskon dan poin |
| payment_status | ENUM | NOT NULL, DEFAULT 'PENDING' | PENDING / PAID / CANCELLED / REFUNDED |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu transaksi dibuat |

### Tabel: `reviews`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → users.id, NOT NULL | Pengguna yang memberi ulasan |
| event_id | UUID | FK → events.id, NOT NULL | Event yang diulas |
| transaction_id | UUID | FK → transactions.id, NOT NULL, UNIQUE | Bukti kehadiran |
| rating | SMALLINT | NOT NULL, CHECK (1–5) | Rating 1–5 bintang |
| comment | TEXT | NULLABLE | Komentar ulasan |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu ulasan dibuat |

### Tabel: `points`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → users.id, NOT NULL | Pemilik poin |
| amount | BIGINT | NOT NULL | Jumlah poin (positif/negatif) |
| type | ENUM | NOT NULL | EARNED / USED |
| description | TEXT | NULLABLE | Keterangan (misal: "Referral dari user X") |
| expired_at | TIMESTAMP | NOT NULL | Tanggal kadaluarsa poin (3 bulan dari earned) |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu poin dibuat |

### Tabel: `coupons`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK | Primary key |
| user_id | UUID | FK → users.id, NOT NULL | Pemilik kupon |
| code | VARCHAR(30) | NOT NULL, UNIQUE | Kode kupon unik |
| discount_percent | SMALLINT | NOT NULL | Persentase diskon (misal: 10) |
| is_used | BOOLEAN | NOT NULL, DEFAULT false | Status pemakaian kupon |
| expired_at | TIMESTAMP | NOT NULL | Tanggal kadaluarsa kupon |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu kupon dibuat |

### Tabel: `promotions`

| Kolom | Tipe | Constraint | Keterangan |
|-------|------|------------|------------|
| id | UUID | PK | Primary key |
| event_id | UUID | FK → events.id, NOT NULL | Event yang dipromosikan |
| type | ENUM | NOT NULL | REFERRAL_CODE / EARLY_BIRD |
| discount_percent | SMALLINT | NULLABLE | Persentase diskon |
| discount_amount | BIGINT | NULLABLE | Nominal diskon tetap dalam IDR |
| code | VARCHAR(30) | NULLABLE | Kode promosi (untuk REFERRAL_CODE) |
| start_date | TIMESTAMP | NULLABLE | Mulai berlaku (untuk EARLY_BIRD) |
| end_date | TIMESTAMP | NULLABLE | Berakhir berlaku |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Waktu dibuat |

## 4.3 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  CUSTOMER
  ORGANIZER
}

enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  PENDING
  PAID
  CANCELLED
  REFUNDED
}

enum PointType {
  EARNED
  USED
}

enum PromotionType {
  REFERRAL_CODE
  EARLY_BIRD
}

model User {
  id           String   @id @default(uuid())
  name         String   @db.VarChar(100)
  email        String   @unique @db.VarChar(150)
  password     String
  role         Role     @default(CUSTOMER)
  referralCode String   @unique @map("referral_code") @db.VarChar(20)
  referredBy   String?  @map("referred_by") @db.VarChar(20)
  avatarUrl    String?  @map("avatar_url")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  events       Event[]
  transactions Transaction[]
  reviews      Review[]
  points       Point[]
  coupons      Coupon[]

  @@map("users")
}

model Category {
  id        String   @id @default(uuid())
  name      String   @unique @db.VarChar(50)
  createdAt DateTime @default(now()) @map("created_at")
  events    Event[]

  @@map("categories")
}

model Event {
  id             String      @id @default(uuid())
  organizerId    String      @map("organizer_id")
  categoryId     String      @map("category_id")
  title          String      @db.VarChar(200)
  description    String
  location       String      @db.VarChar(255)
  price          BigInt      @default(0)
  isFree         Boolean     @default(false) @map("is_free")
  startDate      DateTime    @map("start_date")
  endDate        DateTime    @map("end_date")
  availableSeats Int         @map("available_seats")
  imageUrl       String?     @map("image_url")
  status         EventStatus @default(DRAFT)
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")

  organizer    User          @relation(fields: [organizerId], references: [id])
  category     Category      @relation(fields: [categoryId], references: [id])
  ticketTypes  TicketType[]
  transactions Transaction[]
  reviews      Review[]
  promotions   Promotion[]

  @@map("events")
}

model TicketType {
  id        String   @id @default(uuid())
  eventId   String   @map("event_id")
  name      String   @db.VarChar(100)
  price     BigInt
  quota     Int
  createdAt DateTime @default(now()) @map("created_at")

  event        Event         @relation(fields: [eventId], references: [id])
  transactions Transaction[]

  @@map("ticket_types")
}

model Transaction {
  id             String        @id @default(uuid())
  userId         String        @map("user_id")
  eventId        String        @map("event_id")
  ticketTypeId   String?       @map("ticket_type_id")
  couponId       String?       @map("coupon_id")
  quantity       Int           @default(1)
  basePrice      BigInt        @map("base_price")
  discountAmount BigInt        @default(0) @map("discount_amount")
  pointsUsed     BigInt        @default(0) @map("points_used")
  finalPrice     BigInt        @map("final_price")
  paymentStatus  PaymentStatus @default(PENDING) @map("payment_status")
  createdAt      DateTime      @default(now()) @map("created_at")

  user       User        @relation(fields: [userId], references: [id])
  event      Event       @relation(fields: [eventId], references: [id])
  ticketType TicketType? @relation(fields: [ticketTypeId], references: [id])
  coupon     Coupon?     @relation(fields: [couponId], references: [id])
  review     Review?

  @@map("transactions")
}

model Review {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  eventId       String   @map("event_id")
  transactionId String   @unique @map("transaction_id")
  rating        Int
  comment       String?
  createdAt     DateTime @default(now()) @map("created_at")

  user        User        @relation(fields: [userId], references: [id])
  event       Event       @relation(fields: [eventId], references: [id])
  transaction Transaction @relation(fields: [transactionId], references: [id])

  @@map("reviews")
}

model Point {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  amount      BigInt
  type        PointType
  description String?
  expiredAt   DateTime  @map("expired_at")
  createdAt   DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@map("points")
}

model Coupon {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  code            String   @unique @db.VarChar(30)
  discountPercent Int      @map("discount_percent")
  isUsed          Boolean  @default(false) @map("is_used")
  expiredAt       DateTime @map("expired_at")
  createdAt       DateTime @default(now()) @map("created_at")

  user         User          @relation(fields: [userId], references: [id])
  transactions Transaction[]

  @@map("coupons")
}

model Promotion {
  id              String        @id @default(uuid())
  eventId         String        @map("event_id")
  type            PromotionType
  discountPercent Int?          @map("discount_percent")
  discountAmount  BigInt?       @map("discount_amount")
  code            String?       @db.VarChar(30)
  startDate       DateTime?     @map("start_date")
  endDate         DateTime?     @map("end_date")
  createdAt       DateTime      @default(now()) @map("created_at")

  event Event @relation(fields: [eventId], references: [id])

  @@map("promotions")
}
```

---

# 5. API DESIGN

## 5.1 Konvensi API

- **Base URL:** `http://localhost:5000/api/v1`
- **Format Response:** JSON
- **Autentikasi:** Bearer Token (`Authorization: Bearer <token>`)
- **HTTP Status Codes:**

| Kode | Arti |
|------|------|
| 200 | OK — Request berhasil |
| 201 | Created — Resource berhasil dibuat |
| 400 | Bad Request — Validasi gagal |
| 401 | Unauthorized — Token tidak valid/tidak ada |
| 403 | Forbidden — Role tidak memiliki akses |
| 404 | Not Found — Resource tidak ditemukan |
| 409 | Conflict — Data duplikat |
| 500 | Internal Server Error |

---

## 5.2 Auth API

### POST `/api/v1/auth/register`
**Deskripsi:** Mendaftarkan pengguna baru. Sistem otomatis membuat referral code. Jika menggunakan referral code orang lain, pengguna mendapat kupon diskon 10%.

**Request Body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi@email.com",
  "password": "password123",
  "role": "CUSTOMER",
  "referralCode": "REF-ABC123"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "uuid",
    "name": "Budi Santoso",
    "email": "budi@email.com",
    "role": "CUSTOMER",
    "referralCode": "REF-XYZ789",
    "coupon": {
      "code": "DISC-10-XXXXXX",
      "discountPercent": 10,
      "expiredAt": "2026-06-17T11:00:00Z"
    }
  }
}
```

---

### POST `/api/v1/auth/login`
**Deskripsi:** Login pengguna dan mengembalikan JWT token.

**Request Body:**
```json
{
  "email": "budi@email.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "name": "Budi Santoso",
      "email": "budi@email.com",
      "role": "CUSTOMER"
    }
  }
}
```

---

### GET `/api/v1/auth/me`
**Deskripsi:** Mengambil data pengguna yang sedang login. **(Protected)**

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Budi Santoso",
    "email": "budi@email.com",
    "role": "CUSTOMER",
    "referralCode": "REF-XYZ789",
    "createdAt": "2026-03-17T11:00:00Z"
  }
}
```

---

## 5.3 Event API

### GET `/api/v1/events`
**Deskripsi:** Mengambil daftar event yang dipublikasikan dengan filter, pencarian, dan pagination.

**Query Parameters:**

| Parameter | Tipe | Keterangan |
|-----------|------|------------|
| search | string | Pencarian berdasarkan judul event |
| category | string | Filter berdasarkan ID kategori |
| location | string | Filter berdasarkan lokasi |
| page | number | Halaman (default: 1) |
| limit | number | Jumlah item per halaman (default: 10) |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "Tech Conference 2026",
        "location": "Jakarta",
        "price": 300000,
        "isFree": false,
        "startDate": "2026-04-01T09:00:00Z",
        "imageUrl": "https://...",
        "category": { "id": "uuid", "name": "Teknologi" },
        "availableSeats": 100,
        "averageRating": 4.5
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

### GET `/api/v1/events/:id`
**Deskripsi:** Mengambil detail satu event berdasarkan ID.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Tech Conference 2026",
    "description": "Event teknologi terbesar...",
    "location": "Jakarta Convention Center",
    "price": 300000,
    "isFree": false,
    "startDate": "2026-04-01T09:00:00Z",
    "endDate": "2026-04-01T17:00:00Z",
    "availableSeats": 100,
    "imageUrl": "https://...",
    "organizer": { "id": "uuid", "name": "Org Name" },
    "category": { "id": "uuid", "name": "Teknologi" },
    "ticketTypes": [
      { "id": "uuid", "name": "VIP", "price": 500000, "quota": 20 },
      { "id": "uuid", "name": "Regular", "price": 300000, "quota": 80 }
    ],
    "promotions": [],
    "reviews": [],
    "averageRating": 0
  }
}
```

---

### POST `/api/v1/events`
**Deskripsi:** Membuat event baru. **(Protected — ORGANIZER only)**

**Request Body:**
```json
{
  "title": "Tech Conference 2026",
  "description": "Event teknologi terbesar di Indonesia",
  "categoryId": "uuid",
  "location": "Jakarta Convention Center",
  "price": 300000,
  "isFree": false,
  "startDate": "2026-04-01T09:00:00Z",
  "endDate": "2026-04-01T17:00:00Z",
  "availableSeats": 100,
  "imageUrl": "https://...",
  "ticketTypes": [
    { "name": "VIP", "price": 500000, "quota": 20 },
    { "name": "Regular", "price": 300000, "quota": 80 }
  ]
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Event berhasil dibuat",
  "data": { "id": "uuid", "title": "Tech Conference 2026", "status": "DRAFT" }
}
```

---

### PUT `/api/v1/events/:id`
**Deskripsi:** Memperbarui data event. **(Protected — ORGANIZER, pemilik event)**

**Request Body:** Sama dengan POST, semua field opsional.

**Response 200:**
```json
{
  "success": true,
  "message": "Event berhasil diperbarui",
  "data": { "id": "uuid", "title": "Tech Conference 2026 Updated" }
}
```

---

### DELETE `/api/v1/events/:id`
**Deskripsi:** Menghapus event. **(Protected — ORGANIZER, pemilik event)**

**Response 200:**
```json
{ "success": true, "message": "Event berhasil dihapus" }
```

---

### POST `/api/v1/events/:id/publish`
**Deskripsi:** Mempublikasikan event dari status DRAFT. **(Protected — ORGANIZER)**

**Response 200:**
```json
{ "success": true, "message": "Event berhasil dipublikasikan", "data": { "status": "PUBLISHED" } }
```

---

### POST `/api/v1/events/:id/promotions`
**Deskripsi:** Menambahkan promosi ke event. **(Protected — ORGANIZER)**

**Request Body:**
```json
{
  "type": "EARLY_BIRD",
  "discountPercent": 20,
  "startDate": "2026-03-17T00:00:00Z",
  "endDate": "2026-03-31T23:59:59Z"
}
```

**Response 201:**
```json
{ "success": true, "message": "Promosi berhasil ditambahkan", "data": { "id": "uuid" } }
```

---

## 5.4 Transaction API

### POST `/api/v1/transactions`
**Deskripsi:** Membuat transaksi pembelian tiket. Menggunakan SQL transaction Prisma. **(Protected — CUSTOMER)**

**Request Body:**
```json
{
  "eventId": "uuid",
  "ticketTypeId": "uuid",
  "quantity": 2,
  "couponCode": "DISC-10-XXXXXX",
  "pointsUsed": 20000
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Transaksi berhasil dibuat",
  "data": {
    "id": "uuid",
    "basePrice": 600000,
    "discountAmount": 60000,
    "pointsUsed": 20000,
    "finalPrice": 520000,
    "paymentStatus": "PENDING"
  }
}
```

---

### GET `/api/v1/transactions/my`
**Deskripsi:** Mengambil riwayat transaksi pengguna yang login. **(Protected)**

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "event": { "id": "uuid", "title": "Tech Conference 2026" },
      "quantity": 2,
      "finalPrice": 520000,
      "paymentStatus": "PAID",
      "createdAt": "2026-03-17T11:00:00Z"
    }
  ]
}
```

---

### PATCH `/api/v1/transactions/:id/pay`
**Deskripsi:** Mengkonfirmasi pembayaran (simulasi). **(Protected)**

**Response 200:**
```json
{ "success": true, "message": "Pembayaran berhasil dikonfirmasi", "data": { "paymentStatus": "PAID" } }
```

---

## 5.5 Review API

### POST `/api/v1/reviews`
**Deskripsi:** Membuat ulasan event. User hanya bisa mengulas event yang sudah dibeli dan sudah selesai. **(Protected — CUSTOMER)**

**Request Body:**
```json
{
  "eventId": "uuid",
  "transactionId": "uuid",
  "rating": 5,
  "comment": "Event yang sangat informatif dan terorganisir dengan baik!"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Ulasan berhasil dikirim",
  "data": { "id": "uuid", "rating": 5, "comment": "..." }
}
```

---

### GET `/api/v1/reviews/event/:eventId`
**Deskripsi:** Mengambil semua ulasan untuk sebuah event.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.5,
    "totalReviews": 10,
    "reviews": [
      {
        "id": "uuid",
        "user": { "name": "Budi", "avatarUrl": null },
        "rating": 5,
        "comment": "Sangat bagus!",
        "createdAt": "2026-03-17T11:00:00Z"
      }
    ]
  }
}
```

---

## 5.6 Referral & Points API

### GET `/api/v1/points/my`
**Deskripsi:** Mengambil saldo poin aktif pengguna (belum expired). **(Protected)**

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalPoints": 30000,
    "history": [
      {
        "id": "uuid",
        "amount": 10000,
        "type": "EARNED",
        "description": "Referral dari user: andi@email.com",
        "expiredAt": "2026-06-17T11:00:00Z",
        "createdAt": "2026-03-17T11:00:00Z"
      }
    ]
  }
}
```

---

### GET `/api/v1/coupons/my`
**Deskripsi:** Mengambil semua kupon milik pengguna. **(Protected)**

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "DISC-10-XXXXXX",
      "discountPercent": 10,
      "isUsed": false,
      "expiredAt": "2026-06-17T11:00:00Z"
    }
  ]
}
```

---

## 5.7 Dashboard API (Organizer)

### GET `/api/v1/dashboard/events`
**Deskripsi:** Mengambil daftar event milik organizer. **(Protected — ORGANIZER)**

**Query Params:** `page`, `limit`, `status`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "uuid",
        "title": "Tech Conference 2026",
        "status": "PUBLISHED",
        "availableSeats": 80,
        "totalRegistered": 20,
        "totalRevenue": 6000000
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 5 }
  }
}
```

---

### GET `/api/v1/dashboard/stats`
**Deskripsi:** Mengambil statistik ringkasan organizer. **(Protected — ORGANIZER)**

**Query Params:** `period` (daily | monthly | yearly)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalEvents": 10,
    "totalAttendees": 250,
    "totalRevenue": 75000000,
    "chartData": [
      { "label": "Jan 2026", "revenue": 10000000, "attendees": 30 },
      { "label": "Feb 2026", "revenue": 20000000, "attendees": 70 },
      { "label": "Mar 2026", "revenue": 45000000, "attendees": 150 }
    ]
  }
}
```

---

### GET `/api/v1/dashboard/attendees/:eventId`
**Deskripsi:** Mengambil daftar peserta suatu event. **(Protected — ORGANIZER)**

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "transactionId": "uuid",
      "user": { "name": "Budi Santoso", "email": "budi@email.com" },
      "quantity": 2,
      "finalPrice": 520000,
      "paymentStatus": "PAID",
      "createdAt": "2026-03-17T11:00:00Z"
    }
  ]
}
```
