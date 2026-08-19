import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get Track Record historical progression data
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    if (!studentProfileId) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const snapshots = await prisma.skillSnapshot.findMany({
      where: { studentProfileId },
      orderBy: { createdAt: 'asc' },
    });

    const activitySnapshots = await prisma.activitySnapshot.findMany({
      where: { studentProfileId },
      orderBy: { date: 'asc' },
    });

    const codingProfiles = await prisma.codingProfile.findMany({
      where: { studentProfileId },
    });

    const githubProfile = await prisma.gitHubProfile.findUnique({
      where: { studentProfileId },
    });

    return res.json({
      snapshots,
      activitySnapshots,
      codingProfiles,
      githubProfile,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch track record' });
  }
});

export default router;
