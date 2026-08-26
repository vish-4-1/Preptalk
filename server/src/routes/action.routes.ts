import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get Action Center items
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    if (!studentProfileId) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const actions = await prisma.actionItem.findMany({
      where: { studentProfileId },
      orderBy: [{ completed: 'asc' }, { priority: 'asc' }, { createdAt: 'desc' }],
    });

    return res.json({ actions });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch action items' });
  }
});

// Toggle Action Completion
router.post('/:id/complete', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    const id = req.params.id as string;

    const action = await prisma.actionItem.findFirst({
      where: { id, studentProfileId },
    });

    if (!action) {
      return res.status(404).json({ error: 'Action item not found' });
    }

    const updated = await prisma.actionItem.update({
      where: { id },

      data: {
        completed: !action.completed,
        completedAt: !action.completed ? new Date() : null,
      },
    });

    return res.json({
      message: `Action marked as ${updated.completed ? 'completed' : 'pending'}`,
      action: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to update action' });
  }
});

export default router;
