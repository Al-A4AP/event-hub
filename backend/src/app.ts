import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config';

import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import transactionRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorMiddleware } from './middlewares/error.middleware';

const app = express();

// ─── Security & body ─────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), service: 'EventHub API' });
});

// ─── Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ─── 404 ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// ─── Global Error Handler ─────────────────────────────────
app.use(errorMiddleware);

export default app;
