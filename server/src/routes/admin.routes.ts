import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Placement Cell Admin Dashboard Stats
router.get('/dashboard', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

    const profiles = await prisma.studentProfile.findMany({
      include: {
        user: { select: { name: true, email: true, department: true, branch: true, passoutYear: true } },
        codingProfiles: true,
        gitHubProfile: true,
      },
    });

    let sumReadiness = 0;
    const departmentStats: Record<string, { count: number; sumReadiness: number }> = {};

    const interventionList: any[] = [];

    profiles.forEach((p) => {
      const score = p.placementReadiness || 0;
      sumReadiness += score;

      const dept = p.user.department || 'Computer Science';
      if (!departmentStats[dept]) {
        departmentStats[dept] = { count: 0, sumReadiness: 0 };
      }
      departmentStats[dept].count += 1;
      departmentStats[dept].sumReadiness += score;

      if (score < 65) {
        interventionList.push({
          id: p.id,
          name: p.user.name,
          email: p.user.email,
          department: p.user.department,
          branch: p.user.branch,
          placementReadiness: score,
          primaryGap: score < 50 ? 'Low Problem Solving & DSA Volume' : 'Missing Project Depth / GitHub Repos',
        });
      }
    });

    const averageReadiness = totalStudents > 0 ? Math.round(sumReadiness / totalStudents) : 0;

    const departmentBreakdown = Object.entries(departmentStats).map(([dept, data]) => ({
      department: dept,
      studentCount: data.count,
      averageReadiness: Math.round(data.sumReadiness / data.count),
    }));

    return res.json({
      overview: {
        totalStudents,
        averageReadiness,
        studentsRequiringIntervention: interventionList.length,
        topSkillCategory: 'Data Structures & Algorithms',
      },
      departmentBreakdown,
      interventionList,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch admin dashboard stats' });
  }
});

// Admin Student List with Filtering
router.get('/students', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { department, minReadiness, maxReadiness } = req.query;

    const students = await prisma.studentProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true, department: true, branch: true, passoutYear: true } },
        codingProfiles: true,
        gitHubProfile: true,
        connections: true,
      },
      orderBy: { placementReadiness: 'desc' },
    });

    let filtered = students;
    if (department) {
      filtered = filtered.filter((s) => s.user.department === department);
    }
    if (minReadiness) {
      filtered = filtered.filter((s) => s.placementReadiness >= Number(minReadiness));
    }
    if (maxReadiness) {
      filtered = filtered.filter((s) => s.placementReadiness <= Number(maxReadiness));
    }

    return res.json({ students: filtered });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch students list' });
  }
});

export default router;
