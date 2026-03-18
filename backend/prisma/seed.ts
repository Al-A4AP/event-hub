import { PrismaClient, Role, EventStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const HASH = async (pw: string) => bcrypt.hash(pw, 10);
const PASSWORD = 'Purwadhika123';

// ─── Seed Data ─────────────────────────────────────────────────────────────

const USERS = [
  // 2 Customers
  { name: 'Andi Pratama', email: 'andi.customer@eventhub.com', role: Role.CUSTOMER, referralCode: 'REF-CUST0001' },
  { name: 'Siti Rahayu', email: 'siti.customer@eventhub.com', role: Role.CUSTOMER, referralCode: 'REF-CUST0002' },
  // 2 Organizers
  { name: 'Budi Santoso', email: 'budi.organizer@eventhub.com', role: Role.ORGANIZER, referralCode: 'REF-ORG00001' },
  { name: 'Dewi Kusuma', email: 'dewi.organizer@eventhub.com', role: Role.ORGANIZER, referralCode: 'REF-ORG00002' },
  // 1 Admin
  { name: 'Super Admin', email: 'admin@eventhub.com', role: Role.ADMIN, referralCode: 'REF-ADMIN001' },
];

const slugify = (title: string, suffix: number) =>
  title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') + '-' + suffix;

const futureDate = (daysFromNow: number, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const EVENTS_DATA = [
  // Tech Category
  {
    title: 'DevFest Jakarta 2026',
    description: 'Festival developer terbesar di Jakarta! Temukan sesi dari para expert Google, Meta, dan startup unicorn Indonesia. Networking, workshop, dan hackathon tersedia untuk semua level developer.',
    category: 'Teknologi',
    location: 'Jakarta Convention Center, Jakarta',
    startDay: 15, endDay: 16, price: 250000, seats: 500, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  },
  {
    title: 'AI & Machine Learning Summit',
    description: 'Conference eksklusif mengenai perkembangan AI dan Machine Learning terkini. Pembicara dari Google DeepMind, OpenAI, dan peneliti terkemuka Asia Tenggara.',
    category: 'Teknologi',
    location: 'The Ritz-Carlton Jakarta, Jakarta',
    startDay: 22, endDay: 22, price: 500000, seats: 200, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
  },
  {
    title: 'Startup Bootcamp Bandung',
    description: 'Intensive 3-day bootcamp untuk calon founder startup tech. Mentoring dari investor aktif, workshop pitching, dan kesempatan mendapat seed funding.',
    category: 'Bisnis',
    location: 'Gedung Sate, Bandung',
    startDay: 30, endDay: 32, price: 350000, seats: 100, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
  },
  {
    title: 'Workshop React & Next.js Mastery',
    description: 'Workshop intensif 2 hari untuk memperdalam skill React dan Next.js 15. Dari hooks modern, server components, hingga deployment ke production.',
    category: 'Teknologi',
    location: 'WeWork Thamrin, Jakarta',
    startDay: 10, endDay: 11, price: 450000, seats: 40, image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
  },
  // Music Category
  {
    title: 'Java Jazz Festival 2026',
    description: 'Festival jazz internasional terbesar di Asia! Menampilkan lebih dari 100 artis dari 20 negara, dengan 5 panggung berbeda di seluruh venue.',
    category: 'Musik',
    location: 'Jakarta International Expo, Jakarta',
    startDay: 45, endDay: 47, price: 750000, seats: 10000, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  },
  {
    title: 'Midnight Acoustic — Indie Night',
    description: 'Malam penuh musik akustik dari band-band indie terbaik Indonesia. Nikmati suasana intimate dengan pencahayaan yang hangat dan makanan premium tersedia.',
    category: 'Musik',
    location: 'Rossi Musik Fatmawati, Jakarta',
    startDay: 7, endDay: 7, price: 150000, seats: 150, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
  },
  {
    title: 'Konser Dewa 19 — Reunion Tour',
    description: 'Konser epik reuni Dewa 19 dengan formasi lengkap! Ratusan lagu hits terbaik akan dibawakan dalam satu malam yang tidak terlupakan.',
    category: 'Musik',
    location: 'Gelora Bung Karno, Jakarta',
    startDay: 60, endDay: 60, price: 850000, seats: 50000, image: 'https://images.unsplash.com/photo-1501386761578-eaa54b5a28e7?w=800',
  },
  {
    title: 'Bali Beats Electronic Festival',
    description: 'Festival musik elektronik di surga Bali. DJ internasional dan lokal terbaik, sunrise set di pantai, dan camping ground luxury tersedia.',
    category: 'Musik',
    location: 'Potato Head Beach Club, Bali',
    startDay: 50, endDay: 52, price: 1200000, seats: 2000, image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  },
  // Business Category
  {
    title: 'E-Commerce Summit Indonesia 2026',
    description: 'Konferensi bisnis e-commerce terbesar! Pelajari strategi dari Tokopedia, Shopee, dan brand D2C terlaris. Sesi panel investor dan demo day startup.',
    category: 'Bisnis',
    location: 'Shangri-La Hotel, Jakarta',
    startDay: 35, endDay: 35, price: 800000, seats: 300, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  },
  {
    title: 'Workshop Digital Marketing untuk UMKM',
    description: 'Workshop praktis strategi digital marketing untuk pemilik UMKM. Materi: Instagram Ads, Google Ads, SEO, dan content marketing yang terbukti meningkatkan omzet.',
    category: 'Bisnis',
    location: 'Grand Hyatt Surabaya, Surabaya',
    startDay: 12, endDay: 12, price: 200000, seats: 80, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
  },
  // Sports Category
  {
    title: 'Jakarta Marathon 2026',
    description: 'Event lari tahunan bergengsi Jakarta! Kategori: Full Marathon (42km), Half Marathon, dan Fun Run 10km. Tersedia paket early bird, finisher medal, dan jersey eksklusif.',
    category: 'Olahraga',
    location: 'Monas, Jakarta',
    startDay: 40, endDay: 40, price: 350000, seats: 5000, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  },
  {
    title: 'Yoga & Wellness Retreat Yogyakarta',
    description: 'Retreat yoga 3 hari di tengah ketenangan Yogyakarta. Sesi yoga morning di candi, meditasi, spa tradisional Jawa, dan healthy food dari farm lokal.',
    category: 'Olahraga',
    location: 'Plataran Borobudur Resort, Yogyakarta',
    startDay: 25, endDay: 27, price: 2500000, seats: 30, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
  },
  {
    title: 'Badminton Tournament Open 2026',
    description: 'Turnamen bulu tangkis terbuka untuk semua kalangan! Kategori: Professional, Amateur, dan Junior. Hadiah total Rp 50 juta. Daftarkan timmu sekarang!',
    category: 'Olahraga',
    location: 'GOR Pertamina, Bandung',
    startDay: 18, endDay: 20, price: 100000, seats: 200, image: 'https://images.unsplash.com/photo-1610189352649-54d04f1f1c39?w=800',
  },
  // Arts & Culture
  {
    title: 'Pameran Seni Rupa Nusantara',
    description: 'Pameran seni rupa kontemporer menghadirkan karya dari 50 seniman terpilih seluruh Indonesia. Lukisan, patung, instalasi, dan digital art dalam satu ruang.',
    category: 'Seni',
    location: 'Galeri Nasional Indonesia, Jakarta',
    startDay: 5, endDay: 20, price: 0, seats: 1000, isFree: true, image: 'https://images.unsplash.com/photo-1560195735-8f7c88e4b9e3?w=800',
  },
  {
    title: 'Wayang Kulit Modern — Fusion Show',
    description: 'Pertunjukan wayang kulit modern memadukan tradisi Jawa dengan teknologi proyeksi 3D. Kisah Ramayana diceritakan ulang dengan sentuhan kontemporer.',
    category: 'Seni',
    location: 'Taman Budaya Yogyakarta, Yogyakarta',
    startDay: 14, endDay: 14, price: 120000, seats: 300, image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800',
  },
  // Food & Culinary
  {
    title: 'Surabaya Food Festival 2026',
    description: 'Festival kuliner terbesar Surabaya! 200+ stand makanan dari berbagai daerah Indonesia, cooking competition, food influencer meet & greet, dan live music.',
    category: 'Kuliner',
    location: 'Grand City Mall, Surabaya',
    startDay: 28, endDay: 30, price: 0, seats: 15000, isFree: true, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
  },
  {
    title: 'MasterClass Pastry & Dessert',
    description: 'Kelas memasak eksklusif bersama Chef Aprilia Santoso, peraih Michelin Star Indonesia. Belajar membuat croissant, macarons, dan dessert plating teknik fine dining.',
    category: 'Kuliner',
    location: 'Le Cordon Bleu Jakarta, Jakarta',
    startDay: 8, endDay: 8, price: 750000, seats: 20, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  },
  // Education
  {
    title: 'TEDx Bandung 2026 — Ignite Change',
    description: 'Konferensi TEDx Bandung tahun ini menghadirkan 12 pembicara inspiratif dari berbagai bidang: teknologi, lingkungan, sosial, dan seni. Ideas worth spreading!',
    category: 'Pendidikan',
    location: 'Trans Luxury Hotel, Bandung',
    startDay: 55, endDay: 55, price: 300000, seats: 500, image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
  },
  {
    title: 'Seminar Keuangan Muda — Invest Smart',
    description: 'Seminar literasi keuangan untuk generasi muda. Topik: saham, reksa dana, crypto basics, dan perencanaan keuangan. Gratis untuk mahasiswa dengan kartu pelajar!',
    category: 'Pendidikan',
    location: 'Auditorium UI, Depok',
    startDay: 6, endDay: 6, price: 0, seats: 500, isFree: true, image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
  },
  // Festival
  {
    title: 'Dieng Culture Festival 2026',
    description: 'Festival budaya dan alam di Dataran Tinggi Dieng! Jazz di atas awan, prosesi ruwatan anak berambut gimbal, pesta lampion, dan wisata candi Dieng.',
    category: 'Festival',
    location: 'Dataran Tinggi Dieng, Wonosobo',
    startDay: 70, endDay: 72, price: 450000, seats: 3000, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  },
];

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ── 1. Clear existing data (careful with order due to FK constraints)
  console.log('🗑️ Clearing existing data...');
  await prisma.userVoucher.deleteMany();
  await prisma.userPoint.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleared\n');

  // ── 2. Create Users
  console.log('👥 Creating users...');
  const hashedPw = await HASH(PASSWORD);
  const createdUsers: Record<string, typeof import('@prisma/client').Role> & {[key: string]: any} = {};

  for (const u of USERS) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        password: hashedPw,
        role: u.role,
        referralCode: u.referralCode,
      },
    });
    createdUsers[u.email] = user;
    console.log(`  ✅ ${u.role.padEnd(9)} | ${u.email}`);
  }

  const organizer1 = createdUsers['budi.organizer@eventhub.com'];
  const organizer2 = createdUsers['dewi.organizer@eventhub.com'];

  // ── 3. Create Events (round-robin between 2 organizers)
  console.log('\n🎉 Creating 20 events...');
  const createdEvents = [];

  for (let i = 0; i < EVENTS_DATA.length; i++) {
    const ev = EVENTS_DATA[i];
    const organizer = i % 2 === 0 ? organizer1 : organizer2;
    const startDate = futureDate(ev.startDay);
    const endDate = futureDate(ev.endDay, 21);
    const isFree = (ev as any).isFree === true;
    const price = isFree ? 0 : ev.price;
    const slug = slugify(ev.title, i + 1);

    const event = await prisma.event.create({
      data: {
        organizerId: organizer.id,
        title: ev.title,
        slug,
        description: ev.description,
        category: ev.category,
        location: ev.location,
        startDate,
        endDate,
        price,
        isFree,
        availableSeats: ev.seats,
        totalSeats: ev.seats,
        imageUrl: ev.image,
        status: EventStatus.PUBLISHED,
      },
    });

    // Add ticket types for paid events (some events)
    if (!isFree && i % 3 !== 0) {
      await prisma.ticketType.createMany({
        data: [
          {
            eventId: event.id,
            name: 'Regular',
            price: price,
            quota: Math.floor(ev.seats * 0.7),
            availableSeats: Math.floor(ev.seats * 0.7),
            description: 'Tiket reguler dengan akses ke semua area umum',
          },
          {
            eventId: event.id,
            name: 'VIP',
            price: price * 2,
            quota: Math.floor(ev.seats * 0.3),
            availableSeats: Math.floor(ev.seats * 0.3),
            description: 'Tiket VIP dengan akses eksklusif dan merchandise',
          },
        ],
      });
    }

    createdEvents.push(event);
    console.log(`  ✅ [${i + 1}/20] ${ev.title} (${isFree ? 'GRATIS' : `Rp ${price.toLocaleString('id-ID')}`})`);
  }

  // ── 4. Add referral points for organizers (demo)
  const threeMonths = new Date();
  threeMonths.setMonth(threeMonths.getMonth() + 3);

  await prisma.userPoint.createMany({
    data: [
      { userId: organizer1.id, points: 50000, source: 'REFERRAL_BONUS', expiresAt: threeMonths },
      { userId: organizer2.id, points: 30000, source: 'REFERRAL_BONUS', expiresAt: threeMonths },
      { userId: createdUsers['andi.customer@eventhub.com'].id, points: 10000, source: 'WELCOME_BONUS', expiresAt: threeMonths },
      { userId: createdUsers['siti.customer@eventhub.com'].id, points: 10000, source: 'WELCOME_BONUS', expiresAt: threeMonths },
    ],
  });
  console.log('\n⭐ Referral points added');

  console.log('\n✨ Seed completed!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Account Credentials (password: Purwadhika123!)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 CUSTOMER  | andi.customer@eventhub.com');
  console.log('👤 CUSTOMER  | siti.customer@eventhub.com');
  console.log('🎫 ORGANIZER | budi.organizer@eventhub.com');
  console.log('🎫 ORGANIZER | dewi.organizer@eventhub.com');
  console.log('🔑 ADMIN     | admin@eventhub.com');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📅 20 events created, all PUBLISHED`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
