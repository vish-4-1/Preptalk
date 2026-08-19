import React, { useState } from 'react';
import { ShieldAlert, Users, TrendingUp, AlertTriangle, Filter } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export const AdminDashboard: React.FC = () => {
  const [deptFilter, setDeptFilter] = useState('ALL');

  const studentsList = [
    { id: 's1', name: 'Arun Kumar', email: 'arun.kumar@preptrack.edu.in', dept: 'Computer Science', readiness: 78, status: 'NORMAL', gap: 'Technical Communication & System Mock' },
    { id: 's2', name: 'Priya Sharma', email: 'priya.s@preptrack.edu.in', dept: 'Information Technology', readiness: 86, status: 'EXCELLENT', gap: 'Advanced System Architecture' },
    { id: 's3', name: 'Rohan Verma', email: 'rohan.v@preptrack.edu.in', dept: 'Computer Science', readiness: 54, status: 'INTERVENTION', gap: 'Low LeetCode Solve Volume (DSA < 55)' },
    { id: 's4', name: 'Ananya Roy', email: 'ananya.r@preptrack.edu.in', dept: 'Electronics & Comm', readiness: 61, status: 'INTERVENTION', gap: 'Missing GitHub Repositories & Projects' },
    { id: 's5', name: 'Karthik Raja', email: 'karthik.r@preptrack.edu.in', dept: 'Computer Science', readiness: 92, status: 'EXCELLENT', gap: 'Ready for Tier-1 Product SDE Rounds' },
  ];

  const filteredStudents = deptFilter === 'ALL' ? studentsList : studentsList.filter((s) => s.dept === deptFilter);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Admin Header */}
      <div className="border-b border-[#E5E7EB] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937] flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <span>Placement Cell Administration Portal</span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Institutional overview of student batch placement readiness, department skill gaps, and intervention alerts.
          </p>
        </div>

        <Badge variant="warning">Institutional Admin View</Badge>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Tracked Students" value="142" subtext="Batch of 2027" icon={Users} />
        <StatCard label="Average Readiness Index" value="74/100" subtext="+8% vs last batch" icon={TrendingUp} />
        <StatCard label="Requires Intervention" value="18 Students" subtext="Readiness Index < 65" icon={AlertTriangle} />
        <StatCard label="Top Skill Category" value="DSA (79 avg)" subtext="Strong problem solving" icon={ShieldAlert} />
      </div>

      {/* Department Readiness Breakdown */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-6 rounded-lg space-y-4 shadow-xs">
        <h2 className="text-sm font-bold text-[#1F2937] border-b border-[#E5E7EB] pb-3">
          Department Placement Readiness Comparison
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProgressBar label="Computer Science & Eng. (72 Students)" value={79} sublabel="Avg. Readiness: 79/100" />
          <ProgressBar label="Information Technology (45 Students)" value={76} sublabel="Avg. Readiness: 76/100" />
          <ProgressBar label="Electronics & Comm. (25 Students)" value={64} sublabel="Avg. Readiness: 64/100" />
        </div>
      </div>

      {/* Student Intervention & Tracking Table */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-6 rounded-lg space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
          <div>
            <h2 className="text-sm font-bold text-[#1F2937]">Student Readiness Roster</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Filter by department to identify students requiring targeted intervention.</p>
          </div>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-[#F8F9FA] border border-[#E5E7EB] text-xs font-mono text-[#1F2937] px-3 py-1.5 rounded focus:outline-none focus:border-[#374151]"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
            </select>
          </div>
        </div>

        {/* Scannable Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280] uppercase text-[11px]">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Readiness Index</th>
                <th className="py-2.5 px-3">Primary Opportunity / Gap</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-[#1F2937]">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-[#F8F9FA] transition-colors">
                  <td className="py-3 px-3 font-semibold text-[#1F2937]">{std.name}</td>
                  <td className="py-3 px-3">{std.dept}</td>
                  <td className="py-3 px-3 font-bold text-[#1F2937]">{std.readiness}/100</td>
                  <td className="py-3 px-3 text-[#6B7280]">{std.gap}</td>
                  <td className="py-3 px-3">
                    <Badge
                      variant={
                        std.status === 'EXCELLENT'
                          ? 'success'
                          : std.status === 'INTERVENTION'
                          ? 'error'
                          : 'info'
                      }
                    >
                      {std.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
