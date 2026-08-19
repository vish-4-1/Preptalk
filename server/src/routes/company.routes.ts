import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get Target Companies
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const companies = await prisma.targetCompany.findMany({
      include: { requirements: true },
    });

    const parsedCompanies = companies.map((c) => ({
      ...c,
      targetRoles: JSON.parse(c.targetRolesJson || '[]'),
      requirements: c.requirements.map((r) => ({
        ...r,
        topics: JSON.parse(r.topicsJson || '[]'),
      })),
    }));

    return res.json({ companies: parsedCompanies });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch companies' });
  }
});

// Get Company Readiness for Current Student
router.get('/:id/readiness', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const studentProfileId = req.user?.studentProfileId;
    const { id } = req.params;

    if (!studentProfileId) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const company = await prisma.targetCompany.findUnique({
      where: { id },
      include: { requirements: true },
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        codingProfiles: true,
        gitHubProfile: true,
      },
    });

    const readinessScore = Math.min(
      98,
      Math.max(45, Math.round((profile?.placementReadiness || 70) * (company.difficultyLevel === 'TIER-1' ? 0.9 : 1.05)))
    );

    const missingSkills = company.requirements.filter((r) => r.minScore > (profile?.placementReadiness || 60));

    return res.json({
      company: {
        ...company,
        targetRoles: JSON.parse(company.targetRolesJson || '[]'),
      },
      readinessScore,
      status: readinessScore >= 80 ? 'READY' : readinessScore >= 65 ? 'MODERATE' : 'NEEDS_WORK',
      missingSkills: missingSkills.map((m) => ({
        skillName: m.skillName,
        minScore: m.minScore,
        topics: JSON.parse(m.topicsJson || '[]'),
      })),
      recommendedActions: [
        `Focus on ${company.name} specific dynamic programming patterns`,
        `Practice mock technical interviews with timed constraint`,
        `Review DBMS transactions and indexing concurrency models`,
      ],
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to compute company readiness' });
  }
});

export default router;
