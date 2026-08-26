import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import trackRecordRoutes from './routes/trackRecord.routes';
import actionRoutes from './routes/action.routes';
import projectRoutes from './routes/project.routes';
import companyRoutes from './routes/company.routes';
import adminRoutes from './routes/admin.routes';
import agentRoutes from './routes/agent.routes';

import { createRateLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: allow Vercel frontend in production, localhost in development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

// Rate limiters for security
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 30, // max 30 auth requests per 15 min
  message: 'Too many authentication attempts from this IP. Please try again later.',
});

const syncLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 15, // max 15 sync requests per 5 min
  message: 'Profile synchronization rate limit reached. Please wait before syncing again.',
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile/sync', syncLimiter);
app.use('/api/profile', profileRoutes);
app.use('/api/track-record', trackRecordRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/agent', agentRoutes);



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'PrepTrack Placement & Skill Platform API',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`PrepTrack Server listening on http://localhost:${PORT}`);
});
