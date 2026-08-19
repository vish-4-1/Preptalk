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

  const difficultyData = [
    { name: 'Easy Solved', count: 140, color: '#059669' },
    { name: 'Medium Solved', count: 145, color: '#d97706' },
    { name: 'Hard Solved', count: 27, color: '#dc2626' },
  ];

  const techLanguageData = [
    { language: 'TypeScript', repos: 8, commits: 180 },
    { language: 'Python', repos: 5, commits: 140 },
    { language: 'Java', repos: 3, commits: 110 },
    { language: 'C++', repos: 2, commits: 50 },
  ];

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

        <Badge variant="info">Historical Snapshots: 4 Months Active</Badge>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Overall Score Growth" value="62 → 78" subtext="+16 pts over 4 months" icon={TrendingUp} />
        <StatCard label="DSA Mastery" value="82/100" subtext="Up from 68 in May" icon={Code} />
        <StatCard label="Dev & Projects" value="78/100" subtext="Up from 60 in May" icon={GitBranch} />
        <StatCard label="Contests Attended" value="16 Contests" subtext="Peak Rating: 1742" icon={Award} />
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
