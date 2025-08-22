import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connectDB } from './src/db.js';

import authRoutes from './src/routes/auth.js';
import forumRoutes from './src/routes/forum.js';
import attendanceRoutes from './src/routes/attendance.js';
import adminRoutes from './src/routes/admin.js';
import storageRoutes from './src/routes/storage.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '5mb' }));

// Rate limit cơ bản
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true }));

// Routes
app.use('/api', authRoutes);
app.use('/api', forumRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', adminRoutes);
app.use('/api', storageRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
});
