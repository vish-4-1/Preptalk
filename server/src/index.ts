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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/track-record', trackRecordRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);

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
