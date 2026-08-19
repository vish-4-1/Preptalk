import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-4 rounded-lg flex flex-col justify-between hover:border-[#D1D5DB] transition-all shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#6B7280] uppercase tracking-wider font-medium">{label}</span>
        <div className="p-2 rounded bg-[#F8F9FA] border border-[#E5E7EB] text-[#374151]">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-bold text-[#1F2937] tracking-tight font-mono">{value}</div>
        {subtext && <p className="text-xs text-[#6B7280] mt-1 font-medium">{subtext}</p>}
      </div>

      {trend && (
        <div className="mt-2 pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-xs">
          <span className={trend.isPositive ? 'text-emerald-700 font-mono font-semibold' : 'text-rose-700 font-mono font-semibold'}>
            {trend.value}
          </span>
          <span className="text-[#6B7280] text-[11px]">vs last month</span>
        </div>
      )}
    </div>
  );
};
