import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  height?: string;
  showValue?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  height = 'h-2',
  showValue = true,
}) => {
  const normalized = Math.min(100, Math.max(0, value));

  // Determine bar color based on score
  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 65) return 'bg-blue-600';
    if (score >= 50) return 'bg-amber-600';
    return 'bg-rose-600';
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          {label && <span className="text-[#1F2937] font-semibold">{label}</span>}
          {showValue && <span className="text-[#6B7280] font-medium">{normalized}/100</span>}
        </div>
      )}
      <div className={`w-full bg-[#F8F9FA] rounded-full overflow-hidden border border-[#E5E7EB] ${height}`}>
        <div
          className={`${height} ${getBarColor(normalized)} transition-all duration-500 rounded-full`}
          style={{ width: `${normalized}%` }}
        ></div>
      </div>
      {sublabel && <p className="text-[11px] text-[#6B7280] mt-1">{sublabel}</p>}
    </div>
  );
};
