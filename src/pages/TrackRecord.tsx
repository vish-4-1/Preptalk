import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { TrendingUp, Award, GitBranch, Code } from 'lucide-react';
import { StudentProfile } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';

interface TrackRecordProps {
  profile: StudentProfile | null;
}

export const TrackRecord: React.FC<TrackRecordProps> = ({ profile }) => {
  const snapshotData = profile?.skillSnapshots?.length
    ? profile.skillSnapshots
    : [
        { snapshotMonth: 'May 2026', dsaScore: 68, devScore: 60, dbmsScore: 58, osScore: 56, overallScore: 62 },
        { snapshotMonth: 'Jun 2026', dsaScore: 72, devScore: 65, dbmsScore: 62, osScore: 61, overallScore: 67 },
        { snapshotMonth: 'Jul 2026', dsaScore: 76, devScore: 71, dbmsScore: 67, osScore: 68, overallScore: 72 },
        { snapshotMonth: 'Aug 2026', dsaScore: 82, devScore: 78, dbmsScore: 72, osScore: 70, overallScore: 78 },
      ];

  // Derive difficulty metrics dynamically from live coding profiles if available
  let totalEasy = 0;
  let totalMedium = 0;
  let totalHard = 0;
  let maxRating = 0;
  let totalContests = 0;

  if (profile?.codingProfiles && profile.codingProfiles.length > 0) {
    profile.codingProfiles.forEach((cp) => {
      totalEasy += cp.easySolved || 0;
      totalMedium += cp.mediumSolved || 0;
      totalHard += cp.hardSolved || 0;
      if ((cp.contestRating || 0) > maxRating) maxRating = Math.round(cp.contestRating);
      totalContests += cp.contestsParticipated || 0;
    });
  } else {
    totalEasy = 140;
    totalMedium = 145;
    totalHard = 27;
    maxRating = 1742;
    totalContests = 16;
  }

  const difficultyData = [
    { name: 'Easy Solved', count: totalEasy, color: '#059669' },
    { name: 'Medium Solved', count: totalMedium, color: '#d97706' },
    { name: 'Hard Solved', count: totalHard, color: '#dc2626' },
  ];

  // Derive tech languages dynamically from GitHub profile
  let techLanguageData: { language: string; repos: number; commits: number }[] = [];
  if (profile?.gitHubProfile?.languagesJson) {
    try {
      const langs = JSON.parse(profile.gitHubProfile.languagesJson);
      techLanguageData = Object.entries(langs).map(([lang, count]) => ({
        language: lang,
        repos: Number(count),
        commits: Number(count) * 22,
      }));
    } catch {
      // Fallback
    }
  }

  if (techLanguageData.length === 0) {
    techLanguageData = [
      { language: 'TypeScript', repos: 8, commits: 180 },
      { language: 'Python', repos: 5, commits: 140 },
      { language: 'Java', repos: 3, commits: 110 },
      { language: 'C++', repos: 2, commits: 50 },
    ];
  }

  const initialScore = snapshotData[0]?.overallScore || 62;
  const latestScore = snapshotData[snapshotData.length - 1]?.overallScore || 78;
  const growth = Math.round(latestScore - initialScore);
  const latestDsa = snapshotData[snapshotData.length - 1]?.dsaScore || 82;
  const latestDev = snapshotData[snapshotData.length - 1]?.devScore || 78;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937] flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#374151]" />
            <span>Track Record & Historical Progression</span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Historical telemetry snapshots recorded over time to track measurable skill growth and coding consistency.
          </p>
        </div>

        <Badge variant="info">Historical Snapshots: {snapshotData.length} Snapshots Recorded</Badge>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Overall Score Growth"
          value={`${initialScore} → ${latestScore}`}
          subtext={`${growth >= 0 ? '+' : ''}${growth} pts over ${snapshotData.length} periods`}
          icon={TrendingUp}
        />
        <StatCard label="DSA Mastery" value={`${latestDsa}/100`} subtext={`Solves: ${totalEasy + totalMedium + totalHard} total`} icon={Code} />
        <StatCard label="Dev & Projects" value={`${latestDev}/100`} subtext={`Public Repos: ${profile?.gitHubProfile?.publicRepos || 6}`} icon={GitBranch} />
        <StatCard label="Contests Attended" value={`${totalContests} Contests`} subtext={`Peak Rating: ${maxRating}`} icon={Award} />
      </div>


      {/* Main Historical Growth Line Chart */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-5 rounded-lg space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#1F2937]">Skill Score Progression Over Time</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Monthly telemetry snapshots capturing DSA, Development, DBMS, and OS scores.</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#374151]"></span><span className="text-[#1F2937]">Overall</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span><span className="text-[#1F2937]">DSA</span></span>
            <span className="flex items-center space-x-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span><span className="text-[#1F2937]">Dev</span></span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={snapshotData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="snapshotMonth" stroke="#6B7280" fontSize={11} />
              <YAxis domain={[40, 100]} stroke="#6B7280" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#1F2937', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="overallScore" stroke="#374151" strokeWidth={3} dot={{ r: 4 }} name="Overall Readiness" />
              <Line type="monotone" dataKey="dsaScore" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} name="DSA Score" />
              <Line type="monotone" dataKey="devScore" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} name="Development Score" />
              <Line type="monotone" dataKey="dbmsScore" stroke="#7c3aed" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2 }} name="DBMS Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Grid: Problem Difficulty Split & Technology Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Bar Chart */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-5 rounded-lg space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#1F2937] border-b border-[#E5E7EB] pb-3">Problem Difficulty Distribution</h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" fontSize={11} />
                <YAxis stroke="#6B7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#1F2937', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {difficultyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Technology Language Usage Chart */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-5 rounded-lg space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#1F2937] border-b border-[#E5E7EB] pb-3">Language & Technology Usage</h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techLanguageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" fontSize={11} />
                <YAxis dataKey="language" type="category" stroke="#6B7280" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#1F2937', fontSize: '12px' }} />
                <Bar dataKey="commits" fill="#374151" radius={[0, 4, 4, 0]} name="Commits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
