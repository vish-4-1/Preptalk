import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().optional(),
  branch: z.string().optional(),
  passoutYear: z.number().optional(),
  role: z.enum(['STUDENT', 'ADMIN']).optional().default('STUDENT'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const connectPlatformSchema = z.object({
  platform: z.enum(['GITHUB', 'LEETCODE', 'CODECHEF', 'HACKERRANK', 'LINKEDIN']),
  profileUrl: z.string().url('Must be a valid URL'),
});

export const completeActionSchema = z.object({
  actionId: z.string().uuid().or(z.string().min(1)),
});

export const runAnalysisSchema = z.object({
  targetCompany: z.string().optional(),
});
