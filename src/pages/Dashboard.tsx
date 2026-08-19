import React from 'react';
import {
  Code,
  GitBranch,
  Target,
  Award,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';

interface DashboardProps {
  profile: StudentProfile | null;
  onSync: () => void;
  isSyncing: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onSync, isSyncing }) => {
  const readiness = profile?.placementReadiness || 78;
  const codingTotal = profile?.codingProfiles?.reduce((acc, c) => acc + c.totalSolved, 0) || 637;
  const leetcode = profile?.codingProfiles?.find((c) => c.platform === 'LEETCODE');
  const github = profile?.gitHubProfile;

  const easySolved = leetcode?.easySolved || 140;
  const mediumSolved = leetcode?.mediumSolved || 145;
  const hardSolved = leetcode?.hardSolved || 27;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-6 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937]">Good morning, {profile?.user?.name || 'Arun Kumar'}</h1>
          <p className="text-xs text-[#6B7280] mt-1">Here is where your placement preparation stands today.</p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/actions"
            className="bg-[#374151] hover:bg-[#1F2937] text-white text-xs font-semibold px-4 py-2 rounded flex items-center space-x-2 transition-colors shadow-xs"
          >
            <span>View Today's Action Plan</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Placement Readiness"
          value={`${readiness}/100`}
          subtext="Tier-1 SDE Benchmark: 80+"
          icon={Target}
          trend={{ value: '+6 pts', isPositive: true }}
        />
        <StatCard
          label="Problems Solved"
          value={codingTotal}
          subtext={`LeetCode: ${leetcode?.totalSolved || 312} | Contest: ${leetcode?.contestRating || 1685}`}
          icon={Code}
          trend={{ value: '+42 problems', isPositive: true }}
        />
        <StatCard
          label="GitHub Activity"
          value={`${github?.totalCommits || 480} commits`}
          subtext={`${github?.publicRepos || 18} Repos | ${github?.totalStars || 42} Stars`}
          icon={GitBranch}
          trend={{ value: '+38 commits', isPositive: true }}
        />
        <StatCard
          label="Contest Rating"
          value={leetcode?.contestRating || 1685}
          subtext={`Global Rank: #${(leetcode?.globalRank || 38450).toLocaleString()}`}
          icon={Award}
          trend={{ value: '+45 rating', isPositive: true }}
        />
      </div>

      {/* Placement Readiness Index Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E5E7EB] p-5 rounded-lg space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#374151]" />
                <span>Placement Readiness Index Breakdown</span>
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">Transparent calculation based on normalized student telemetry.</p>
            </div>
            <Badge variant="info">Index: {readiness}/100</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <ProgressBar label="Data Structures & Algorithms" value={82} sublabel="312 problems solved (145 Medium, 27 Hard)" />
            <ProgressBar label="Development & Projects" value={78} sublabel="18 GitHub repos, 480 commits, Java & TS" />
            <ProgressBar label="Database Management (DBMS)" value={72} sublabel="SQL normalization, indexing, transaction models" />
            <ProgressBar label="Operating Systems & Concurrency" value={70} sublabel="Process synchronization & deadlock theory" />
            <ProgressBar label="Aptitude & Analytical Reasoning" value={80} sublabel="Quantitative reasoning baseline" />
            <ProgressBar label="Technical Communication" value={68} sublabel="Mock interview articulation score" />
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#E5E7EB]">
            <div className="bg-[#F8F9FA] p-3 rounded border border-[#E5E7EB] flex items-start space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-[#1F2937]">Highest Strength: </span>
                <span className="text-[#374151]">Data Structures & Algorithms (82/100)</span>
                <p className="text-[#6B7280] text-[11px] mt-0.5">Solid problem solving volume on arrays, binary search, and trees.</p>
              </div>
            </div>

            <div className="bg-[#F8F9FA] p-3 rounded border border-[#E5E7EB] flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-[#1F2937]">Biggest Opportunity: </span>
                <span className="text-[#374151]">Technical Communication (68/100)</span>
                <p className="text-[#6B7280] text-[11px] mt-0.5">Schedule 1 system design mock interview to practice trade-off articulation.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Distribution & Streak */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-5 rounded-lg flex flex-col justify-between space-y-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-[#1F2937] border-b border-[#E5E7EB] pb-3 flex items-center justify-between">
              <span>Coding Difficulty Breakdown</span>
              <span className="text-xs font-mono text-[#6B7280]">{codingTotal} Solved</span>
            </h2>

            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-700 font-semibold">Easy</span>
                  <span className="text-[#374151] font-medium">{easySolved} problems</span>
                </div>
                <div className="w-full bg-[#F8F9FA] h-2 rounded-full border border-[#E5E7EB] overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: `${(easySolved / codingTotal) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-amber-700 font-semibold">Medium</span>
                  <span className="text-[#374151] font-medium">{mediumSolved} problems</span>
                </div>
                <div className="w-full bg-[#F8F9FA] h-2 rounded-full border border-[#E5E7EB] overflow-hidden">
                  <div className="bg-amber-600 h-full" style={{ width: `${(mediumSolved / codingTotal) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-rose-700 font-semibold">Hard</span>
                  <span className="text-[#374151] font-medium">{hardSolved} problems</span>
                </div>
                <div className="w-full bg-[#F8F9FA] h-2 rounded-full border border-[#E5E7EB] overflow-hidden">
                  <div className="bg-rose-600 h-full" style={{ width: `${(hardSolved / codingTotal) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F9FA] p-3.5 rounded border border-[#E5E7EB] text-xs space-y-1">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[#6B7280]">Active Coding Streak</span>
              <span className="text-[#374151] font-bold">14 Days</span>
            </div>
            <p className="text-[#6B7280] text-[11px]">Consistently solving 2+ problems daily over the last 2 weeks.</p>
          </div>
        </div>
      </div>

      {/* Action Center Widget & AI Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E5E7EB] p-5 rounded-lg space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div>
              <h2 className="text-sm font-bold text-[#1F2937] flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Recommended Next Actions</span>
              </h2>
              <p className="text-xs text-[#6B7280] mt-0.5">High-priority tasks selected based on your profile telemetry.</p>
            </div>
            <Link to="/actions" className="text-xs text-[#374151] hover:text-[#1F2937] font-mono flex items-center space-x-1 font-semibold">
              <span>View all actions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {profile?.actionItems?.slice(0, 3).map((action) => (
              <div key={action.id} className="bg-[#F8F9FA] p-3.5 rounded border border-[#E5E7EB] flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge variant={action.priority === 'HIGH' ? 'error' : 'warning'} size="sm">
                      {action.priority} PRIORITY
                    </Badge>
                    <span className="text-xs font-semibold text-[#1F2937]">{action.title}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] pl-1">{action.reason}</p>
                </div>
                <span className="text-[11px] font-mono text-[#6B7280] shrink-0 border border-[#E5E7EB] px-2 py-0.5 rounded bg-[#FFFFFF]">
                  Est. {action.estimatedHours}h
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Reasoning Summary */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-5 rounded-lg space-y-3 shadow-xs">
          <h2 className="text-sm font-bold text-[#1F2937] border-b border-[#E5E7EB] pb-3 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#374151]" />
            <span>AI Placement Reasoning</span>
          </h2>

          <p className="text-xs text-[#374151] leading-relaxed">
            {profile?.summary ||
              'Arun Kumar demonstrates a solid coding foundation with 312 solved problems on LeetCode and 18 public GitHub repos. Primary growth opportunity lies in graph algorithms and unit test coverage.'}
          </p>

          <div className="pt-2">
            <Link
              to="/build-next"
              className="w-full bg-[#F8F9FA] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-xs text-[#1F2937] py-2 rounded flex items-center justify-center space-x-2 transition-colors font-semibold"
            >
              <span>Explore "Build Next" Project Ideas</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
