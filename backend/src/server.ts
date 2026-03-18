import 'dotenv/config';
import app from './app';
import { prisma } from './config/database';

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected (Supabase PostgreSQL)');

    app.listen(PORT, () => {
      console.log(`🚀 EventHub API running on http://localhost:${PORT}`);
      console.log(`📋 Health: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1);
  }
};

start();
