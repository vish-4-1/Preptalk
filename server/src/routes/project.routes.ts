import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get Project Recommendations ("Build Next")
router.get('/recommendations', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    if (!studentProfileId) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const projectRecommendations = await prisma.projectRecommendation.findMany({
      where: { studentProfileId },
      orderBy: { createdAt: 'desc' },
    });

    const parsedProjects = projectRecommendations.map((p) => ({
      ...p,
      technologies: JSON.parse(p.technologiesJson || '[]'),
      skillsDeveloped: JSON.parse(p.skillsDevelopedJson || '[]'),
      milestones: JSON.parse(p.milestonesJson || '[]'),
    }));

    return res.json({ projects: parsedProjects });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch project recommendations' });
  }
});

export default router;
