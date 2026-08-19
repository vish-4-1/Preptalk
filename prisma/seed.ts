import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PrepTrack Database with Vishal Devikumar profile...');

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // 1. Target Companies
  await prisma.targetCompany.upsert({
    where: { name: 'Amazon' },
    update: {},
    create: {
      name: 'Amazon',
      difficultyLevel: 'TIER-1',
      overview: 'Focuses heavily on Data Structures, Algorithms (Graphs, DP, Trees), System Design, and Leadership Principles.',
      targetRolesJson: JSON.stringify(['Software Development Engineer I', 'SDE Intern']),
      requirements: {
        create: [
          { skillName: 'Data Structures & Algorithms', minScore: 82, priority: 'HIGH', topicsJson: JSON.stringify(['Graph Traversal', 'Dynamic Programming', 'Tries']) },
          { skillName: 'System Design & Scalability', minScore: 78, priority: 'HIGH', topicsJson: JSON.stringify(['Caching Strategy', 'Distributed Queues']) },
          { skillName: 'DBMS & Object Oriented Design', minScore: 75, priority: 'MEDIUM', topicsJson: JSON.stringify(['Transaction Isolation', 'Schema Design']) },
        ],
      },
    },
  });

  await prisma.targetCompany.upsert({
    where: { name: 'Microsoft' },
    update: {},
    create: {
      name: 'Microsoft',
      difficultyLevel: 'TIER-1',
      overview: 'Emphasizes clean problem-solving, code optimization, Operating Systems fundamentals, and collaborative design.',
      targetRolesJson: JSON.stringify(['Software Engineer (Level 59)', 'Graduate SDE']),
      requirements: {
        create: [
          { skillName: 'Data Structures & Algorithms', minScore: 80, priority: 'HIGH', topicsJson: JSON.stringify(['Binary Trees', 'Arrays & Strings', 'Heap']) },
          { skillName: 'Operating Systems & Concurrency', minScore: 78, priority: 'HIGH', topicsJson: JSON.stringify(['Process Management', 'Deadlocks', 'Paging']) },
        ],
      },
    },
  });

  // 2. Admin User
  await prisma.user.upsert({
    where: { email: 'admin@preptrack.edu.in' },
    update: {},
    create: {
      name: 'Dr. Ramesh Sharma (Placement Director)',
      email: 'admin@preptrack.edu.in',
      password: adminPasswordHash,
      role: 'ADMIN',
      department: 'Placement Cell',
      branch: 'Administration',
    },
  });

  // 3. User: Vishal Devikumar
  console.log('Seeding Student Profile for Vishal Devikumar (vishaldevikumar@gmail.com)...');
  const existingVishal = await prisma.user.findUnique({ where: { email: 'vishaldevikumar@gmail.com' } });
  if (!existingVishal) {
    await prisma.user.create({
      data: {
        name: 'Vishal Devikumar',
        email: 'vishaldevikumar@gmail.com',
        password: passwordHash,
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        branch: 'B.Tech CSE',
        passoutYear: 2027,
        studentProfile: {
          create: {
            username: 'vishaldevikumar',
            targetRole: 'Software Development Engineer',
            placementReadiness: 95,
            summary: 'Vishal Devikumar demonstrates a solid coding foundation with 637 solved problems and 14 public GitHub repositories. Primary growth opportunity lies in graph algorithms, system design trade-offs, and unit test coverage.',
            connections: {
              create: [
                { platform: 'GITHUB', profileUrl: 'https://github.com/vishaldevikumar', isConnected: true, lastSyncedAt: new Date() },
                { platform: 'LEETCODE', profileUrl: 'https://leetcode.com/vishaldevikumar', isConnected: true, lastSyncedAt: new Date() },
                { platform: 'CODECHEF', profileUrl: 'https://codechef.com/users/vishaldevikumar', isConnected: true, lastSyncedAt: new Date() },
                { platform: 'HACKERRANK', profileUrl: 'https://hackerrank.com/profile/vishaldevikumar', isConnected: true, lastSyncedAt: new Date() },
                { platform: 'LINKEDIN', profileUrl: 'https://linkedin.com/in/vishaldevikumar', isConnected: true, lastSyncedAt: new Date() },
              ],
            },
            gitHubProfile: {
              create: {
                totalRepos: 14,
                publicRepos: 14,
                totalStars: 23,
                totalForks: 8,
                totalCommits: 342,
                prCount: 19,
                issueCount: 6,
                languagesJson: JSON.stringify({ TypeScript: 6, Python: 4, Java: 3, CPlusPlus: 1 }),
                topReposJson: JSON.stringify([
                  { name: 'campus-connect-microservices', description: 'Spring Boot & React platform for student peer tutoring', repoUrl: 'https://github.com/vishaldevikumar/campus-connect-microservices', stars: 12, forks: 4, language: 'Java', commitCount: 84 },
                  { name: 'algo-visualizer-v2', description: 'Interactive graph and tree algorithm solver with step debugging', repoUrl: 'https://github.com/vishaldevikumar/algo-visualizer-v2', stars: 8, forks: 3, language: 'TypeScript', commitCount: 56 },
                ]),
              },
            },
            codingProfiles: {
              create: [
                { platform: 'LEETCODE', totalSolved: 312, easySolved: 140, mediumSolved: 145, hardSolved: 27, contestRating: 1685, globalRank: 38450, contestsParticipated: 16 },
                { platform: 'CODECHEF', totalSolved: 185, easySolved: 90, mediumSolved: 75, hardSolved: 20, contestRating: 1742, globalRank: 18200, contestsParticipated: 22 },
                { platform: 'HACKERRANK', totalSolved: 140, easySolved: 80, mediumSolved: 50, hardSolved: 10, contestRating: 1540, globalRank: 52000, contestsParticipated: 8 },
              ],
            },
            skillSnapshots: {
              create: [
                { snapshotMonth: '2026-05', dsaScore: 78, devScore: 75, dbmsScore: 72, osScore: 70, overallScore: 74 },
                { snapshotMonth: '2026-06', dsaScore: 84, devScore: 82, dbmsScore: 79, osScore: 78, overallScore: 81 },
                { snapshotMonth: '2026-07', dsaScore: 90, devScore: 88, dbmsScore: 85, osScore: 84, overallScore: 87 },
                { snapshotMonth: '2026-08', dsaScore: 98, devScore: 100, dbmsScore: 97, osScore: 95, overallScore: 95 },
              ],
            },
            actionItems: {
              create: [
                { title: 'Solve 10 Medium Graph Problems on LeetCode', category: 'Coding', priority: 'HIGH', estimatedHours: 6, reason: 'Recommended because graph problem representation is currently your largest algorithmic gap for product-based company rounds.', completed: false },
                { title: 'Implement Redis Caching & PostgreSQL Indexing', category: 'Project', priority: 'HIGH', estimatedHours: 8, reason: 'Adding query caching to your primary GitHub project demonstrates real-world backend performance optimization.', completed: false },
                { title: 'Review Operating Systems Memory Management & Concurrency', category: 'Theory', priority: 'MEDIUM', estimatedHours: 4, reason: 'Essential CS fundamental topic frequently asked in technical screening interviews.', completed: true, completedAt: new Date() },
                { title: 'Conduct 1 Timed System Design Mock Interview', category: 'Mock Interview', priority: 'MEDIUM', estimatedHours: 2, reason: 'Improves technical articulation and architectural tradeoff reasoning under interviewer constraints.', completed: false },
              ],
            },
            projectRecommendations: {
              create: [
                {
                  title: 'Distributed Task Queue & Rate Limiter Engine',
                  problemStatement: 'Build a high-performance distributed background job processor with token-bucket rate limiting and sliding window metrics.',
                  whySuited: 'Complements your strong backend background while addressing your System Design and concurrency skill gap.',
                  technologiesJson: JSON.stringify(['TypeScript', 'Node.js', 'Redis', 'PostgreSQL', 'Docker']),
                  skillsDevelopedJson: JSON.stringify(['Distributed Systems', 'Redis Data Structures', 'Rate Limiting', 'Concurrency']),
                  difficulty: 'INTERMEDIATE',
                  estimatedDuration: '2 weeks',
                  milestonesJson: JSON.stringify(['Design schema and queue data structures in Redis', 'Implement producer-consumer worker thread pool', 'Integrate Prometheus/Grafana metric telemetry']),
                },
                {
                  title: 'Automated Code Review Bot with Static Analysis',
                  problemStatement: 'Develop a GitHub App webhook service that automatically parses Pull Requests, checks AST anti-patterns, and computes cyclomatic complexity.',
                  whySuited: 'Leverages your existing GitHub API experience while building developer tools prized by software engineering teams.',
                  technologiesJson: JSON.stringify(['Node.js', 'AST Parser', 'GitHub REST API', 'Docker']),
                  skillsDevelopedJson: JSON.stringify(['Static Code Analysis', 'AST Processing', 'GitHub Webhooks', 'CI/CD']),
                  difficulty: 'ADVANCED',
                  estimatedDuration: '3 weeks',
                  milestonesJson: JSON.stringify(['Set up GitHub App OAuth and webhook payload listener', 'Implement JavaScript/TypeScript AST tree parser', 'Post automated review inline comments on PR diffs']),
                },
              ],
            },
          },
        },
      },
    });
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
